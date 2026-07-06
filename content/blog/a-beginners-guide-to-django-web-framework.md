---
title: "A Beginner's Guide to Django Web Framework"
description: "A comprehensive beginner's guide to the Django web framework, covering its architecture, features, and step-by-step instructions on building your first app."
date: "2023-10-30"
updated: "2023-10-30"
tags: ["python","django","web-development","backend","programming"]
readTime: 7
image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*HVKOLLX7wprRbHTl2IPDcQ.png"
author: "Murat Hüdavendigâr Öncü"
---
If you are looking to build robust, scalable, and secure web applications rapidly, you have likely heard of Django. Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design.

Built by experienced developers, it takes care of much of the hassle of web development, so you can focus on writing your app without needing to reinvent the wheel. It is famously known as the *"batteries-included"* framework.

> "The web framework for perfectionists with deadlines." — Django Software Foundation

### Why Choose Django?

Before diving into the code, let us understand why Django is the framework of choice for tech giants like Instagram, Pinterest, and Spotify.

1. **Batteries Included:** It comes with out-of-the-box support for authentication, URL routing, a template engine, an object-relational mapper (ORM), and database schema migrations.
2. **Security:** Django helps developers avoid many common security mistakes, such as SQL injection, cross-site scripting (XSS), cross-site request forgery (CSRF), and clickjacking.
3. **Scalability:** It uses a "share-nothing" architecture, meaning you can add hardware at any level to scale your application seamlessly.

### The MVT Architecture

Unlike the traditional MVC (Model-View-Controller) architecture, Django uses the **MVT (Model-View-Template)** pattern.

- **Model:** The logical data structure behind the entire application, represented by a database.
- **View:** The user interface — what you see in your browser when you visit a website. In Django, views are Python functions or classes that receive a web request and return a web response.
- **Template:** A static HTML file containing special syntax that allows Django to dynamically inject data into it.

### Getting Started: Installation

To get started, you need Python installed on your machine. Once Python is ready, installing Django is a breeze using `pip`.

```bash
# Install Django globally or inside a virtual environment
pip install django
```

After installation, you can initialize your very first project.

```bash
# Create a new Django project
django-admin startproject my_awesome_project
cd my_awesome_project
```

### Creating an App

In Django, a project is a collection of configurations and apps. An app is a web application that does something specific (like a blog system, a database of public records, or a simple polling app).

```bash
python manage.py startapp blog
```

### Defining Models

Models are the single, definitive source of truth about your data. Here is an example of a simple blog post model.

```python
from django.db import models
from django.utils import timezone

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    published_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title
```

Once you define your models, Django's powerful ORM writes the SQL queries for you. You just need to run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

### Views and URLs

To display something on the screen, you need a View and a URL pattern to route traffic to that view.

```python
# blog/views.py
from django.http import HttpResponse

def hello_world(request):
    return HttpResponse("<h1>Hello, Django World!</h1>")
```

Then, link this view to a URL.

```python
# my_awesome_project/urls.py
from django.urls import path
from blog.views import hello_world

urlpatterns = [
    path('hello/', hello_world, name='hello_world'),
]
```

### The Django Admin

Perhaps the most beloved feature of Django is the automatic admin interface. By simply registering your models, Django reads metadata from them to provide a quick, model-centric interface where trusted users can manage content on your site.

```python
# blog/admin.py
from django.contrib import admin
from .models import Post

admin.site.register(Post)
```

### Conclusion

Django provides an incredible foundation for web development. By handling the difficult, repetitive tasks, it frees you to focus on what makes your application unique. Whether you are building a simple prototype or an enterprise-grade API, Django has the tools you need.

---

[Read the original full version on Medium](https://medium.com/stackademic/a-beginners-guide-to-django-web-framework-241d9c14bf32)