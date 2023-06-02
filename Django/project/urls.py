from django.urls import path

from project.services.QRservices import QRCode
from project.views import ProjectAPIView, CommentAPIView, CommentReactionCreate, TaskListView, TaskView, TaskUserView, \
    TaskViewNext, AnalysisView

urlpatterns = [
    path('projects/', ProjectAPIView.as_view(), name='project_list'),
    path('comment/<int:task_id>/team/<int:team_id>/', CommentAPIView.as_view(), name='comment_api'),
    path('comment/<int:comment_id>/reaction/<int:team_id>/', CommentReactionCreate.as_view(),
         name='comment_reaction_api'),
    path('projects/<int:project_id>/tasks/', TaskListView.as_view(), name='task'),
    path('task/<int:task_id>/', TaskView.as_view(), name='task'),
    path('task/nextStep/<int:task_id>/', TaskViewNext.as_view(), name='task'),
    path('tasks/<int:task_id>/user/', TaskUserView.as_view(), name='task_user'),
    path('qrcode/<str:hashcode>/', QRCode.generate_qrcode, name='generate_qrcode'),
    path('get-analysis/', AnalysisView.as_view(), name='get_analysis'),
]
