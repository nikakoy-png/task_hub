import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DJANGO_SERVER.settings')

app = Celery('DJANGO_SERVER')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

