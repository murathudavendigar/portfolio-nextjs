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

Before you can log in to that interface, you need an account with admin privileges. Django ships a command for exactly that:

```bash
python manage.py createsuperuser
```

Answer the prompts for username, email, and password, then run the development server and visit `/admin/`.

```bash
python manage.py runserver
```

Navigate to `http://127.0.0.1:8000/admin/` and log in. You will see a full CRUD interface for the `Post` model — list view, add form, edit form, delete confirmation — generated entirely from the model definition you wrote earlier. No HTML was written for any of it.

### Registering an App in Settings

New apps do not activate themselves. A common stumbling block for beginners is creating an app with `startapp` and then wondering why its models never show up in migrations or the admin. You have to register it in `INSTALLED_APPS`.

```python
# my_awesome_project/settings.py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'blog',  # <-- your app goes here
]
```

Until `blog` appears in that list, `makemigrations` will not see any of its models, and the admin site will have nothing to register against.

### Rendering Templates Instead of Raw HTML

The `hello_world` view above returns raw HTML from a Python string, which is fine for a demo but not how real Django apps work. In practice, views render templates — HTML files that live in a `templates/` directory and can loop over and display data passed from the view.

```python
# blog/views.py
from django.shortcuts import render
from .models import Post

def post_list(request):
    posts = Post.objects.order_by('-published_date')
    return render(request, 'blog/post_list.html', {'posts': posts})
```

```html
<!-- blog/templates/blog/post_list.html -->
{% for post in posts %}
  <article>
    <h2>{{ post.title }}</h2>
    <p>{{ post.content|truncatewords:30 }}</p>
    <time>{{ post.published_date|date:"F j, Y" }}</time>
  </article>
{% empty %}
  <p>No posts yet.</p>
{% endfor %}
```

The `{% for %}` and `{{ }}` syntax is Django's template language. It deliberately does not allow arbitrary Python execution inside templates — that separation is a design choice, not a limitation, and it keeps your presentation logic from leaking business logic.

### Common Pitfalls for Beginners

A handful of mistakes account for most of the confusion new Django developers run into:

- **Forgetting to run migrations after changing a model.** If you add or rename a field and skip `makemigrations` and `migrate`, the database schema silently drifts out of sync with your code, and you will get confusing `OperationalError` exceptions at runtime rather than at write time.
- **Editing `urls.py` in the wrong place.** Django distinguishes between the project-level `urls.py` (in the folder matching your project name) and per-app `urls.py` files. Beginners often add every route to the project-level file, which works but throws away Django's app-based modularity.
- **Mutating `QuerySet` results without understanding laziness.** `Post.objects.all()` does not hit the database until you iterate over it, slice it, or call something like `list()` on it. Filtering it further (`Post.objects.all().filter(...)`) is cheap because no query has run yet — but this also means a `QuerySet` evaluated inside a loop will silently re-query the database on every iteration if you are not careful.
- **Using the development server in production.** `runserver` prints a warning for a reason — it is single-threaded by default and not hardened for public traffic. Production deployments use a WSGI/ASGI server such as Gunicorn or Uvicorn behind a reverse proxy.

### Django vs. Flask: When to Choose Which

New Python web developers often ask whether to start with Django or a micro-framework like Flask. Both are legitimate choices, but they optimize for different things:

- **Django** bundles an ORM, admin panel, auth system, and forms library out of the box. That is a strong fit for content-heavy sites, internal tools, and CRUD-shaped applications where you would otherwise have to assemble those pieces yourself.
- **Flask** gives you a routing layer and templating engine and leaves everything else — database access, authentication, project structure — up to you. That is appealing for small APIs, microservices, or projects with unconventional architecture where Django's conventions would get in the way.

If you are unsure, the batteries-included nature of Django tends to save more time than it costs for anything resembling a standard web app — you can always strip pieces out later, but bolting an ORM and admin interface onto Flask after the fact is considerably more work.

### Conclusion

Django provides an incredible foundation for web development. By handling the difficult, repetitive tasks — migrations, admin tooling, template rendering, security defaults — it frees you to focus on what makes your application unique. Whether you are building a simple prototype or an enterprise-grade API, Django has the tools you need, and the patterns above (models, views, templates, and the admin) are the same four building blocks you will reach for on every project you build with it.