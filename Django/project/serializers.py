from rest_framework import serializers

from project.models import Project, Task, Comment, CommentReaction


class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True, default=serializers.CurrentUserDefault())

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'created_at', 'updated_at', 'owner', 'team']

    def validate(self, data):
        if not data.get('name'):
            raise serializers.ValidationError("Project name cannot be blank.")

        return data


class TaskSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    created_user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    status = serializers.ReadOnlyField(source='get_status_display')

    class Meta:
        model = Task
        fields = (
            'id', 'title', 'description', 'priority', 'created_at', 'created_user', 'update_at',
            'update_user', 'due_date', 'completed', 'project', 'accountable', 'status')


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('commenter', 'created_at', 'updated_at', 'created_user', 'task')

    def validate(self, data):
        parent_comment = data.get('parent_comment', None)
        if parent_comment and parent_comment == data.get('id', None):
            raise serializers.ValidationError('Comment cannot be replied to itself.')
        return data


class CommentReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentReaction
        fields = '__all__'
        read_only_fields = ('create_at', 'updated_at', 'user', 'comment')

    def validate(self, data):
        user = self.context['request'].user
        comment = data.get('comment')
        reaction_type = data.get('reaction_type')

        if CommentReaction.objects.filter(user=user, comment=comment).exists():
            existing_reaction = CommentReaction.objects.get(user=user, comment=comment)
            if existing_reaction.reaction_type == reaction_type:
                raise serializers.ValidationError(
                    'User has already reacted with the same type of reaction to this comment.')
            else:
                existing_reaction.delete()

        return data
