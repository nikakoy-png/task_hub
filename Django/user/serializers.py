from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken

from user.models import User


class UserSerializer(serializers.ModelSerializer):
    img = serializers.ImageField(use_url=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, source='get_role_display')

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'img', 'team', 'role')


class UserRegistrationSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(write_only=True)
    img = serializers.ImageField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password_confirm', 'img']
        extra_kwargs = {'password': {'write_only': True}, 'img': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        img = validated_data.pop('img')
        user = User.objects.create_user(**validated_data)
        user.img = img
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255, write_only=True, required=True)
    password = serializers.CharField(max_length=128, write_only=True, required=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        user = authenticate(username=username, password=password)
        if user is None:
            raise ValidationError('Invalid username/password')

        refresh = RefreshToken.for_user(user)

        data = {}
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['user'] = user

        return data
