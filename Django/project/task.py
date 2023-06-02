import time

from DJANGO_SERVER.celery import app
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


@app.task
def send_email(to_msg: str, msg_tag: str, context: str):
    msg = MIMEMultipart()
    msg['From'] = 'NASVAAVSAN@hotmail.com'
    msg['To'] = to_msg
    msg['Subject'] = msg_tag
    message = context
    msg.attach(MIMEText(message, 'plain'))
    server = smtplib.SMTP('smtp.office365.com', 587)
    server.starttls()
    # replace pass
    server.login(msg['From'], 'pas222')
    text = msg.as_string()
    server.sendmail(msg['From'], msg['To'], text)
    server.quit()
