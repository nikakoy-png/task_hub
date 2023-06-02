from django.db import models
from django.shortcuts import get_object_or_404

from API.models import Team
from user.models import User


class ProjectQuerySet(models.QuerySet):
    def create_project(self, serializer, data_user, team):
        serializer.save(owner=data_user, team=team)


class ProjectManager(models.Manager):
    def get_queryset(self):
        return CommentReactionQuerySet(self.model)

    def set_reaction(self, reaction_type, user, comment):
        return self.get_queryset().set_reaction(reaction_type, user, comment)

    def get_count_reaction(self, comment, reaction_type):
        return self.get_queryset().get_count_reaction(comment=comment, reaction_type=reaction_type)


class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, default=None)

    def __str__(self):
        return self.name


class TaskQuerySet(models.QuerySet):
    def get_task_for_currently_user(self, user):
        qs = self.filter(accountable=user.id).order_by('-priority')
        qs = qs.order_by('due_date')
        return qs


class TaskManager(models.Manager):
    def get_queryset(self):
        return TaskQuerySet(self.model)

    def get_task_for_currently_user(self, user):
        return self.get_queryset().get_task_for_currently_user(user)


class Task(models.Model):
    PRIORITY_CHOICES = (
        ('1', 'Low'),
        ('2', 'Medium'),
        ('3', 'High'),
    )

    STATUS_CHOICES = (
        ('0', 'canceled'),
        ('1', 'In progress'),
        ('2', 'Review'),
        ('3', 'Bug fix'),
        ('4', 'Ready for deploy'),
        ('5', 'Done'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    priority = models.CharField(max_length=1, choices=PRIORITY_CHOICES, default='1')
    created_at = models.DateTimeField(auto_now_add=True)
    created_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks')
    update_at = models.DateTimeField(auto_now=True)
    update_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='updated_tasks', blank=False,
                                    default=None, null=True)
    due_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='1')
    completed = models.BooleanField(default=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    accountable = models.ForeignKey(User, on_delete=models.CASCADE, related_name='accountable_tasks',
                                    blank=True, null=True)
    func_manager = models.Manager()
    func = TaskManager()

    def __str__(self):
        return self.title


class Comment(models.Model):
    content = models.TextField()
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, related_name='replies', null=True, blank=True)
    commenter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.commenter.username}'s comment on {self.task.title}"


class Invite_team(models.Model):
    ROLE_CHOICES = (
        ('1', 'admin'),
        ('2', 'developer'),
        ('3', 'manager'),
        ('4', 'QA'),
        ('5', 'architect'),
        ('6', 'SEO')
    )

    role = models.CharField(max_length=1, choices=ROLE_CHOICES, null=True, default=None)
    id_team = models.ForeignKey(Team, on_delete=models.CASCADE)
    id_inv = models.ForeignKey(User, on_delete=models.CASCADE)
    hash_code = models.TextField()
    accept = models.BooleanField(default=False)


class CommentReactionQuerySet(models.QuerySet):
    def set_reaction(self, reaction_type, user, comment):
        reaction = self.get(user=user, comment=comment)
        if reaction.reaction_type == reaction_type:
            reaction.delete()
        else:
            reaction.reaction_type = reaction_type
            reaction.save()

    def get_count_reaction(self, comment, reaction_type):
        reactions = self.filter(comment=comment)
        count_reaction = reactions.filter(reaction_type=reaction_type).count()
        return count_reaction


class CommentReactionManager(models.Manager):
    def get_queryset(self):
        return CommentReactionQuerySet(self.model)

    def set_reaction(self, reaction_type, user, comment):
        return self.get_queryset().set_reaction(reaction_type, user, comment)

    def get_count_reaction(self, comment, reaction_type):
        return self.get_queryset().get_count_reaction(comment=comment, reaction_type=reaction_type)


"""from_queryset - используют для гибкого управления менеджерами, чтоб можно было удобно с одного QuerySet перейти на
другой"""


# ReactionManager = CommentReactionManager.from_queryset(CommentReactionQuerySet)


class CommentReaction(models.Model):
    REACTION_CHOICES = (
        ('like', 'Like'),
        ('dislike', 'Dislike'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='reactions')
    reaction_type = models.CharField(max_length=7, choices=REACTION_CHOICES)

    objects = models.Manager()
    reaction = CommentReactionManager()


class Notification(models.Model):
    pass
