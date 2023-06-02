import json

from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework import serializers
from API.permissions import TeamAccessPermission
from user.serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer

User = get_user_model()


def json_response(data, status):
    response_data = json.dumps(data, default=str)
    return HttpResponse(response_data, content_type='application/json', status=status)


class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token = get_tokens_for_user(user)
            return Response(token, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Add Upd, Del after release client
class UserView(ListAPIView, RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, TeamAccessPermission,)

    def get(self, request, *args, **kwargs):
        try:
            user = get_object_or_404(User, pk=self.kwargs['user_id'])
            serializer = UserSerializer(user)
            return Response(serializer.data, status=200)
        except ObjectDoesNotExist:
            return Response({'error': 'User not found'}, status=404)

    def update(self, request, *args, **kwargs):
        print(self.request.user.role in ('1', '2'))
        print(self.request.user.role)
        if self.request.user.id == self.kwargs['user_id'] or self.request.user.role in ('1', '2'):
            user = get_object_or_404(User, pk=self.kwargs['user_id'])
            user.role = self.request.data['role']
            user.save()
            return Response(UserSerializer(user).data)
        raise PermissionError("You have not permission for this action!")


@api_view(['GET'])
def get_user_by_email(request, email):
    try:
        user = User.objects.filter(email=email).first()
        if user:
            serializer = UserSerializer(user)
            return Response(serializer.data, status=200)
        else:
            return Response({'error': 'User not found'}, status=404)
    except ObjectDoesNotExist:
        return Response({'error': 'User not found'}, status=404)


class UsersView(ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, TeamAccessPermission,)

    def get_queryset(self):
        return User.objects.filter(team=self.kwargs['team_id'])


class UserLoginView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            user = request.user
            serializer = UserSerializer(user)
            return Response(serializer.data, status=200)
        except ObjectDoesNotExist:
            return Response({'error': 'User not found'}, status=404)

    def post(self, request):
        try:
            serializer = UserLoginSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            token = get_tokens_for_user(user)
            return json_response(token, status=status.HTTP_200_OK)
        except ValidationError as e:
            return JsonResponse({"error": str(e)}, status=403)

    def options(self, request, *args, **kwargs):
        return Response({'Allow': 'GET, POST'}, status=status.HTTP_200_OK, headers={
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        })


async def create_user(username, password):
    user = User(username=username)
    user.set_password(password)
    await user.save()
    return user


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    access = AccessToken.for_user(user)
    return {'refresh': str(refresh), 'access': str(access)}
