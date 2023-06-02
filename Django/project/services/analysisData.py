import base64
import io

import pandas as pd
import matplotlib.pyplot as plt
from django.http import HttpResponse


class AnalysisData:
    def __init__(self, **kwargs):
        self.users = kwargs.get('users')
        self.tasks = kwargs.get('tasks')
        self.df = None

    def merge_users_tasks(self):
        data = {'users': [], 'tasks': []}
        task_counts = {}

        for user in self.users:
            tasks_completed = [task.accountable.username for task_list in self.tasks
                               for task in task_list if task.accountable == user and task.status == '5']
            tasks_need_to_do = [task.accountable.username for task_list in self.tasks
                                for task in task_list if task.accountable == user and task.status != '5']
            if len(tasks_completed) == 0:
                continue
            data['users'].append(user.username + (' [Completed]' if tasks_completed else ''))
            data['users'].append(user.username + (' [Need to do]' if tasks_need_to_do else ''))
            data['tasks'].append(len(tasks_completed))
            data['tasks'].append(len(tasks_need_to_do))

            task_counts[user.username + ' [Completed]'] = len(tasks_completed)
            task_counts[user.username + ' [Need to do]'] = len(tasks_need_to_do)

        self.df = pd.DataFrame(data)
        self.task_counts = task_counts

    def plot_pie_chart(self, response, name_team):
        fig, ax = plt.subplots(figsize=(8, 8), facecolor="none")
        wedges, labels, _ = ax.pie(self.df['tasks'], labels=self.df['users'], autopct='%1.1f%%', startangle=90)

        for i, (label, count) in enumerate(self.task_counts.items()):
            if count > 0:
                y = 0.04 - i * 0.05
                ax.text(0.05, y, f'{label}: {count}', transform=ax.transAxes, ha='left', bbox=dict(facecolor='white', edgecolor='black', boxstyle='round'))

        ax.set_title(f'Analysis for {name_team}')
        plt.tight_layout()
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        plt.close()
        buf.seek(0)

        response.write(buf.getvalue())
