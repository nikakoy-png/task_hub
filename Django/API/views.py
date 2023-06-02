from django.contrib.auth import get_user_model
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

from API.models import Team
from API.serializers import TeamSerializer

User = get_user_model()


class TeamListView(ListCreateAPIView):
    serializer_class = TeamSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Team.objects.get(self.request.user.team)

    def perform_create(self, serializer):
        team = serializer.save()
        self.request.user.team = team
        self.request.user.role = '1'
        self.request.user.save()
