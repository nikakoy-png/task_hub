from django.shortcuts import get_object_or_404
from rest_framework.permissions import BasePermission

from API.models import Team


class TeamAccessPermission(BasePermission):
    def has_permission(self, request, view):
        team = get_object_or_404(Team, pk=request.user.team.pk)
        return team == request.user.team

