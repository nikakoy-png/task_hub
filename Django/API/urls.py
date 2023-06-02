from django.urls import path
from API.views import *

urlpatterns = [
    path('team/', TeamListView.as_view(), name='project_list'),
]
