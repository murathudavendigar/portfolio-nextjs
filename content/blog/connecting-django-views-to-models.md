---
title: "Connecting Django Views to Models: Building Data-Driven Web Applications"
description: "Learn how to connect Django views to models and databases to build data-driven web applications with full CRUD functionality."
date: "2023-11-03"
updated: "2023-11-03"
tags: ["django","python","web development","database","backend"]
readTime: 6
image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*GbxMC6aVMiBsBzso6Xsf8Q.jpeg"
author: "Murat Hüdavendigâr Öncü"
---
Data is at the heart of many web applications, and in Django, models serve as the gatekeepers to your application's data. In this article, we'll explore how to connect Django views to models and databases, empowering your project to create, read, update, and delete data. We'll provide comprehensive code examples to illustrate this essential aspect of web development.

---

### Understanding the Role of Models

In Django, models are the bridge between your application and the database. They define the structure of your data and provide an interface for interacting with it. Models help you create, retrieve, update, and delete records in the database, making them fundamental to data-driven web applications.

Think of a model as a blueprint. Just as Murat might sketch out the structure of a blog post before writing it, a Django model defines the shape of your data before it ever reaches the database.

---

### Creating a Model

Let's start by creating a simple model for a "Task" in a to-do list application. This model will allow us to interact with tasks stored in a database.

#### Step 1: Defining a Model

In your Django project, open the `models.py` file of an existing app or create a new app using:

```
python manage.py startapp tasks
```

Define your model in the `models.py` file within the app directory:

```python
from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
```

Here, we've defined a `Task` model with four fields: `title`, `description`, `completed`, and `created_at`. The `__str__` method provides a human-readable string representation of a task — when Murat lists his tasks in the Django admin, he'll see the title instead of something like `Task object (1)`.

#### Step 2: Creating Database Tables

To create the corresponding database table for the `Task` model, run the following commands:

```
python manage.py makemigrations
python manage.py migrate
```

These commands will create the necessary database schema based on your model definition. Think of migrations as a version history for your database structure.

---

### Building Views

Now that we have a model, let's build views to interact with the data. We'll cover listing, creating, updating, and deleting tasks.

#### Step 3: Listing Tasks

To display a list of tasks, create a view function in your app's `views.py` file:

```python
from django.shortcuts import render
from .models import Task

def task_list(request):
    tasks = Task.objects.all().order_by('-created_at')
    return render(request, 'tasks/task_list.html', {'tasks': tasks})
```

This view retrieves all tasks from the database using `Task.objects.all()`, ordered by the newest first, and passes them to a template. The corresponding template might look like this:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Task List</title>
</head>
<body>
    <h1>Murat's Task List</h1>
    <ul>
        {% for task in tasks %}
            <li>
                <strong>{{ task.title }}</strong> - 
                {{ task.description }}
                {% if task.completed %} (Done) {% endif %}
            </li>
        {% endfor %}
    </ul>
</body>
</html>
```

You can also filter tasks. For example, to show only incomplete tasks:

```python
def pending_tasks(request):
    tasks = Task.objects.filter(completed=False)
    return render(request, 'tasks/task_list.html', {'tasks': tasks})
```

#### Step 4: Creating Tasks

To allow users to create new tasks, you need a view, a form, and a URL pattern.

In `forms.py` (create this file in your app's directory):

```python
from django import forms
from .models import Task

class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'description', 'completed']
```

In `views.py`:

```python
from django.shortcuts import render, redirect
from .models import Task
from .forms import TaskForm

def create_task(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('task_list')
    else:
        form = TaskForm()
    return render(request, 'tasks/create_task.html', {'form': form})
```

This view handles two scenarios: when the page is first visited (`GET`), it shows an empty form. When the form is submitted (`POST`), it validates and saves the new task. If Murat fills in the title as "Write Django article" and submits, a new `Task` record is created in the database.

#### Step 5: Updating and Deleting Tasks

To allow users to update and delete tasks, add the following views:

```python
from django.shortcuts import render, redirect, get_object_or_404
from .models import Task
from .forms import TaskForm

def update_task(request, task_id):
    task = get_object_or_404(Task, pk=task_id)
    if request.method == 'POST':
        form = TaskForm(request.POST, instance=task)
        if form.is_valid():
            form.save()
            return redirect('task_list')
    else:
        form = TaskForm(instance=task)
    return render(request, 'tasks/update_task.html', {'form': form, 'task': task})

def delete_task(request, task_id):
    task = get_object_or_404(Task, pk=task_id)
    if request.method == 'POST':
        task.delete()
        return redirect('task_list')
    return render(request, 'tasks/delete_task.html', {'task': task})
```

`get_object_or_404` is a handy Django shortcut — if a task with the given `task_id` doesn't exist, Django automatically returns a 404 page instead of crashing. For example, if Murat tries to edit task #99 that doesn't exist, the user will see a clean "Not Found" page.

#### Step 6: Wiring Up the URLs

Don't forget to register all your views in `urls.py`:

```python
from django.urls import path
from . import views

urlpatterns = [
    path('tasks/', views.task_list, name='task_list'),
    path('tasks/new/', views.create_task, name='create_task'),
    path('tasks/<int:task_id>/edit/', views.update_task, name='update_task'),
    path('tasks/<int:task_id>/delete/', views.delete_task, name='delete_task'),
]
```

With these four URL patterns, you have a fully functional CRUD interface for tasks.

---

### Relating Models: Adding a Foreign Key

Real applications rarely have a single, isolated model. Tasks usually belong to something — a project, a user, a team. Django models this with `ForeignKey`, which creates a many-to-one relationship.

```python
from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
```

The `on_delete=models.CASCADE` argument tells Django what to do when a `Project` is deleted — in this case, delete every `Task` that belongs to it. Other common options are `PROTECT` (refuse to delete the project while tasks reference it) and `SET_NULL` (clear the reference, which requires the field to allow `null=True`). Choosing the wrong one is a common source of surprising data loss, so it is worth deciding deliberately rather than accepting the default you copied from a tutorial.

The `related_name='tasks'` argument lets you query in the reverse direction — from a project, back to its tasks — without writing a second model:

```python
project = Project.objects.get(pk=1)
open_tasks = project.tasks.filter(completed=False)
```

### Why Does the N+1 Query Problem Matter in Django?

Once you introduce relationships, it becomes easy to write a view that looks correct but issues far more database queries than necessary. Consider a template that lists tasks alongside their project name:

```python
def task_list(request):
    tasks = Task.objects.all()
    return render(request, 'tasks/task_list.html', {'tasks': tasks})
```

```html
{% for task in tasks %}
  <li>{{ task.title }} — {{ task.project.name }}</li>
{% endfor %}
```

This looks fine, but every access to `task.project.name` inside the loop triggers a separate database query to fetch that project, because the `ForeignKey` is lazily resolved. With 50 tasks across a handful of projects, that is 51 queries (1 for the tasks, 50 for the projects) instead of 2. This is the classic "N+1 query problem," and it is one of the most common Django performance mistakes.

The fix is `select_related`, which tells Django to fetch the related row in the same SQL query using a `JOIN`:

```python
def task_list(request):
    tasks = Task.objects.select_related('project').all()
    return render(request, 'tasks/task_list.html', {'tasks': tasks})
```

Now the whole list renders with a single query, regardless of how many tasks or projects are involved. For many-to-many relationships (where `select_related` does not apply), the equivalent tool is `prefetch_related`, which runs a second query and joins the results in Python rather than in SQL.

### Function-Based Views vs. Class-Based Views

Every view in this article has been a plain Python function — a **function-based view (FBV)**. Django also offers **class-based views (CBVs)**, which package common patterns like "list objects" or "edit an object" into reusable classes:

```python
from django.views.generic import ListView, CreateView
from .models import Task

class TaskListView(ListView):
    model = Task
    template_name = 'tasks/task_list.html'
    context_object_name = 'tasks'

class TaskCreateView(CreateView):
    model = Task
    fields = ['title', 'description', 'completed']
    template_name = 'tasks/create_task.html'
    success_url = '/tasks/'
```

`TaskListView` above does the same job as the `task_list` function you wrote earlier, in four lines instead of four. The trade-off is discoverability: with an FBV, every line of behavior is visible in the function body. With a CBV, behavior is inherited from a base class, and understanding what `ListView` actually does often means reading Django's source or documentation. For simple CRUD screens, CBVs remove real boilerplate. For views with unusual branching logic, an FBV is usually easier for the next person (including future-you) to follow at a glance. Most production Django codebases end up using both, choosing per-view rather than picking one style for the whole project.

---

### Conclusion

By connecting Django views to models and databases, you can build powerful, data-driven web applications. In this article, we've seen how to define models, create database tables, and build views to interact with data — covering the full cycle of creating, reading, updating, and deleting records, relating models with foreign keys, avoiding the N+1 query trap with `select_related`, and choosing between function-based and class-based views.

In the next article, we'll explore Django forms more deeply, which will enable us to handle user input and validation more effectively.

Stay tuned for more Django web development insights! Happy coding!