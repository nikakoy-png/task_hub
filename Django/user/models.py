from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import QuerySet

from API.models import Team


# class UserQuerySet(models.QuerySet):
#     def get_user_by_team(self, team) -> QuerySet:
#         users = self.filter(team=team)
#         return users
#
#
# class User12123Manager(models.Manager):
#     def get_queryset(self):
#         return UserQuerySet(self.model)
#
#     def get_user_by_team(self, team):
#         return self.get_queryset().get_user_by_team(team)


class User(AbstractUser):
    ROLE_CHOICES = (
        ('1', 'admin'),
        ('2', 'developer'),
        ('3', 'manager'),
        ('4', 'QA'),
        ('5', 'architect'),
        ('6', 'SEO')
    )
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, default=None)
    img = models.ImageField(upload_to='user_images/', default='default_photo.png')
    role = models.CharField(max_length=1, choices=ROLE_CHOICES, null=True, default=None)
    # objects = models.Manager()
    # userQS = UserManager()
    #