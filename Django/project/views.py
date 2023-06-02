from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListCreateAPIView, DestroyAPIView, RetrieveUpdateAPIView, CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView

from API.models import Team
from API.permissions import TeamAccessPermission
from project.models import Project, Task, Comment, CommentReaction
from project.serializers import TaskSerializer, ProjectSerializer, CommentSerializer, CommentReactionSerializer
from project.services import analysisData
from project.services.analysisData import AnalysisData

from project.task import send_email

User = get_user_model()


class CommentAPIView(CreateAPIView, DestroyAPIView, ListAPIView, RetrieveUpdateAPIView):
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated, TeamAccessPermission,)

    def get_queryset(self):
        return Comment.objects.filter(task=self.kwargs['task_id'])

    def perform_create(self, serializer):
        serializer.save(commenter=self.request.user, task_id=self.kwargs['task_id'])

    def destroy(self, request, *args, **kwargs):
        comment = get_object_or_404(Comment, pk=self.request.data['comment_id'])
        if not self.request.user.role == '1' or not self.request.user == comment.commenter:
            raise PermissionDenied("You don't have permission to destroy comment for this project.")
        self.perform_destroy(comment)
        return Response(status=status.HTTP_202_ACCEPTED)

    def update(self, request, *args, **kwargs):
        comment = get_object_or_404(Comment, pk=self.request.data['comment_id'])
        if not self.request.user == comment.commenter:
            raise PermissionDenied("You don't have permission to update comment for this project.")
        serializer = self.get_serializer(comment, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class CommentReactionCreate(ListCreateAPIView):
    renderer_classes = [JSONRenderer]
    serializer_class = CommentReactionSerializer
    permission_classes = (IsAuthenticated, TeamAccessPermission,)

    def perform_create(self, serializer):
        comment = Comment.objects.get(pk=self.kwargs['comment_id'])
        reaction_type = serializer.validated_data['reaction_type']
        user = self.request.user

        try:
            CommentReaction.reaction.set_reaction(reaction_type, user, comment)
        except CommentReaction.DoesNotExist:
            serializer.save(user=user, comment=comment)

    def list(self, request, *args, **kwargs):
        comment = get_object_or_404(Comment, pk=self.kwargs['comment_id'])
        count_like = CommentReaction.reaction.get_count_reaction(comment=comment, reaction_type='like')
        count_dislike = CommentReaction.reaction.get_count_reaction(comment=comment, reaction_type='dislike')
        user_reaction = None
        try:
            user_reaction = CommentReaction.objects.get(user=self.request.user, comment=comment).reaction_type
        except CommentReaction.DoesNotExist:
            pass
        data = {'count_like': count_like, 'count_dislike': count_dislike, 'user_reaction': user_reaction}
        return Response(data)


class TaskListView(ListCreateAPIView, DestroyAPIView, RetrieveUpdateAPIView):
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated, TeamAccessPermission,)

    def destroy(self, request, *args, **kwargs):
        if not self.request.user.role in ('1', '2'):
            raise PermissionDenied("You don't have permission to destroy tasks for this project.")
        task = get_object_or_404(Task, pk=self.request.data['task'])
        self.perform_destroy(task)
        return Response(status=status.HTTP_202_ACCEPTED)

    def update(self, request, *args, **kwargs):
        task = get_object_or_404(Task, pk=self.request.data['task'])
        if not self.request.user.role in ('1', '2'):
            raise PermissionDenied("You don't have permission to update tasks for this project.")
        serializer = self.get_serializer(task, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def get_queryset(self):
        project = get_object_or_404(Project, pk=self.kwargs['project_id'])
        return Task.func.select_related('project').filter(project=project)

    def perform_create(self, serializer):
        project_id = self.kwargs['project_id']
        project = get_object_or_404(Project, pk=project_id)
        if not self.request.user.role in ('1', '2'):
            raise PermissionDenied("You don't have permission to create tasks for this project.")
        serializer.save(project=project, created_user=self.request.user)
        # users = User.objects.filter(team=self.request.user.team.pk)
        # for user in users:
        #     print(user.email)
        #     send_email.delay(user.email, "test", "test" + str(random.uniform(2.5, 10.0)))


class ProjectAPIView(CreateAPIView, DestroyAPIView, ListAPIView, RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated, TeamAccessPermission,)
    serializer_class = ProjectSerializer

    def update(self, request, *args, **kwargs):
        project = get_object_or_404(Project, pk=self.request.data['project_id'])
        if not '1' == self.request.user.role:
            raise PermissionDenied("You don't have permission to update this Project!")
        serializer = self.get_serializer(project, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=self.request.user)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        project = get_object_or_404(Project, pk=self.request.data['project_id'])
        if not '1' == self.request.user.role:
            raise PermissionDenied("You don't have permission to delete this Project!")
        self.perform_destroy(project)
        return Response(status=status.HTTP_202_ACCEPTED)

    def get_queryset(self):
        return Project.objects.select_related('team').filter(team=self.request.user.team.pk)

    def perform_create(self, serializer):
        team = get_object_or_404(Team, pk=self.request.user.team.pk)
        serializer.save(owner=self.request.user, team=team)


class AnalysisView(APIView):
    def get(self, request, *args, **kwargs):
        analysis = AnalysisData(users=User.objects.filter(team=self.request.user.team.pk),
                            tasks=[Task.func.filter(project=project) for project in Project.objects.filter(
                                team=self.request.user.team.pk)])
        analysis.merge_users_tasks()
        response = HttpResponse(content_type='image/png')
        analysis.plot_pie_chart(response, name_team=self.request.user.team.name)

        return response



class TaskView(APIView):
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated, TeamAccessPermission,)

    def get(self, request, *args, **kwargs):
        try:
            task = get_object_or_404(Task, pk=self.kwargs['task_id'])
            serializer = TaskSerializer(task)
            return Response(serializer.data, status=200)
        except ObjectDoesNotExist:
            return Response({'error': 'Task not found'}, status=404)


class TaskViewNext(RetrieveUpdateAPIView):
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated, TeamAccessPermission,)

    def update(self, request, *args, **kwargs):
        task = get_object_or_404(Task, pk=self.kwargs['task_id'])
        if self.request.user.id == task.accountable.id or self.request.user.role in ('1', '2'):
            if task.status != '5':
                task.status = str(int(task.status) + 1)
                task.save()
                return Response(TaskSerializer(task).data)
        raise PermissionError("You have not permission for this action!")


# View for user with filter
class TaskUserView(ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated, TeamAccessPermission,)

    def get_queryset(self):
        return Task.func.get_task_for_currently_user(user=self.request.user)
