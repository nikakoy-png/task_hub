# используйте официальный образ Python в качестве базового образа
FROM python:3.9-slim-buster

# устанавливаем зависимости и ставим их в соответствующую директорию
RUN apt-get update && \
    apt-get -y install netcat && \
    apt-get clean

# устанавливаем зависимости проекта
RUN pip install --upgrade pip
COPY ./requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install -r requirements.txt

# копируем проект в контейнер
COPY . /app

RUN python manage.py migrate

# запускаем приложение
ENTRYPOINT ["python", "manage.py", "runserver", "0.0.0.0:8000"]
