from django.test import TestCase

from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from API.models import Team
from project.models import Project, Task
from user.views import User


class TaskListViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.team = Team.objects.create(name='Test', user=self.user)
        self.project = Project.objects.create(name='Test Project', owner=self.user, team=self.team)
        self.task = Task.objects.create(title='Test Task', project=self.project, created_user=self.user)
        self.user.team = self.team
        self.user.role = '1'

    def test_create(self):
        url = reverse('task', kwargs={'project_id': self.project.id})
        data = {'title': 'New Task', 'project': self.project.id, 'team': self.team.id}
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        task = Task.objects.get(pk=response.data['id'])
        self.assertEqual(task.title, data['title'])
        self.assertEqual(task.project, self.project)
        self.assertEqual(task.created_user, self.user)

    def test_update(self):
        url = reverse('task', kwargs={'project_id': self.project.id})
        data = {'title': 'Updated Task', 'task': self.task.id, "project": self.project.id}
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        task = Task.objects.get(pk=self.task.id)
        self.assertEqual(task.title, data['title'])

    def test_destroy(self):
        url = reverse('task', kwargs={'project_id': self.project.id})
        data = {'task_id': self.task.id, 'task': self.task.id, "project": self.project.id}
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url, data)
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        with self.assertRaises(Task.DoesNotExist):
            Task.objects.get(pk=self.task.id)
