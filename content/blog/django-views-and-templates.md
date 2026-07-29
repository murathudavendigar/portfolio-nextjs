---
title: "Django Views and Templates: Crafting Web Pages with Python"
description: "Learn how Django views and templates work together to craft dynamic web pages using Python, with simple step-by-step examples."
date: "2023-11-01"
updated: "2023-11-01"
tags: ["django","python","web development","templates","backend"]
readTime: 4
image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*hq6Po-SIC5PQyel5-xizWw.jpeg"
author: "Murat Hüdavendigâr Öncü"
---
In the world of web development, creating dynamic and interactive web pages is a fundamental requirement. Django, a popular web framework, simplifies this process through the use of views and templates. In this article, we'll explore Django views and templates, understanding how they work together to craft the web pages of your application. We'll provide simple and clear examples to illustrate their use.

---

### The Role of Views and Templates

#### Views: Handling Logic

Django views are Python functions that define what content is displayed on a web page. They handle the logic of your application and determine what data is presented to the user. In simple terms, views are responsible for processing user requests and returning appropriate responses.

#### Templates: Crafting the Look

Templates are HTML files that define the structure and layout of your web pages. They enable you to mix HTML with dynamic content from your views, creating the final page that the user sees. Templates allow you to separate the presentation from the logic, making it easier to maintain and customize your application's appearance.

---

### Creating a Basic View

Let's start with an example of creating a basic view to display a personalized greeting. This is the simplest form of a Django view.

#### Step 1: Writing a View Function

In your Django project, open the app's `views.py` file. If you don't already have an app, you can create one using:

```
python manage.py startapp myapp
```

In `myapp/views.py`, define a simple view function:

```python
from django.http import HttpResponse

def greet_murat(request):
    return HttpResponse("Welcome to Murat's Django blog!")
```

The `greet_murat` view function takes a `request` parameter and returns an `HttpResponse` with a simple welcome message.

#### Step 2: URL Mapping

To make this view accessible, you need to map it to a URL. In your project's `urls.py` file, add a URL pattern:

```python
from django.urls import path
from myapp.views import greet_murat

urlpatterns = [
    path('welcome/', greet_murat, name='greet_murat'),
]
```

Now, when a user visits `/welcome/`, the greeting message will be displayed.

---

### Using Templates

In more complex cases, you'll want to use templates to create dynamic web pages. Templates allow you to include placeholders for data that your views will fill in.

#### Step 3: Creating a Template

Create an HTML template file in your app's `templates` directory. For example, create `welcome.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Welcome</title>
</head>
<body>
    <h1>{{ greeting }}</h1>
    <p>This page was crafted by {{ author }}.</p>
</body>
</html>
```

Here, `{{ greeting }}` and `{{ author }}` are placeholders that the view will fill in dynamically.

#### Step 4: Rendering the Template

Modify your view to render the template with actual data:

```python
from django.shortcuts import render

def greet_murat(request):
    context = {
        'greeting': 'Welcome to Django Views and Templates!',
        'author': 'Murat'
    }
    return render(request, 'welcome.html', context)
```

By using `render`, you pass the template name and a context dictionary containing the data to fill in the placeholders.

---

### How Does Template Inheritance Avoid Repeated HTML?

Copy-pasting the same `<head>`, navigation bar, and footer into every template quickly becomes unmanageable. Django solves this with **template inheritance** — a base template defines the shared structure, and child templates fill in only the parts that change.

Start with a base template:

```html
<!-- myapp/templates/base.html -->
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}My Site{% endblock %}</title>
</head>
<body>
    <nav>Murat's Django Blog</nav>
    <main>
        {% block content %}{% endblock %}
    </main>
    <footer>&copy; 2023</footer>
</body>
</html>
```

Then extend it from `welcome.html` instead of repeating the boilerplate:

```html
<!-- myapp/templates/welcome.html -->
{% extends "base.html" %}

{% block title %}Welcome{% endblock %}

{% block content %}
    <h1>{{ greeting }}</h1>
    <p>This page was crafted by {{ author }}.</p>
{% endblock %}
```

`{% extends %}` must be the first tag in the child template. Everything between a matching pair of `{% block %}` / `{% endblock %}` tags in the child overrides the corresponding block in the parent — anything outside a block in the child template is simply ignored. This is the single biggest lever for keeping template code maintainable as a site grows past a handful of pages.

### Common Template Filters and Tags

Beyond variable interpolation, Django's template language ships a set of built-in filters for formatting data without writing Python in the view:

```html
{{ post.title|upper }}                 <!-- UPPERCASE THE TITLE -->
{{ post.content|truncatewords:20 }}     <!-- first 20 words -->
{{ post.published_date|date:"F j, Y" }} <!-- November 3, 2023 -->
{{ tasks|length }}                      <!-- count of items -->
{{ user.bio|default:"No bio yet." }}    <!-- fallback for empty values -->
```

Filters are applied with a pipe (`|`) and can be chained. Tags like `{% if %}`, `{% for %}`, and `{% with %}` handle control flow. Keeping logic like this in the template — rather than pre-formatting strings in the view — is precisely the separation of concerns templates exist for.

### Serving Static Files (CSS, JavaScript, Images)

Templates rarely stay unstyled for long. Django needs to be told where your CSS and JavaScript live and how to generate correct URLs for them, since those URLs can change between development and production.

```python
# settings.py
STATIC_URL = 'static/'
STATICFILES_DIRS = [BASE_DIR / "myapp/static"]
```

```html
{% load static %}
<link rel="stylesheet" href="{% static 'myapp/style.css' %}">
```

`{% load static %}` must appear before any `{% static %}` tag is used in a template. The tag resolves to the correct URL automatically, so you never hardcode a path that might differ between your local machine and a production server behind a CDN.

### Common Pitfalls with Views and Templates

- **Forgetting `{% load static %}`.** Without it, every `{% static %}` tag in that template raises a `TemplateSyntaxError`. It has to be declared per-template, not once globally.
- **Putting business logic in templates.** The template language deliberately cannot call arbitrary Python methods with arguments or catch exceptions. If you find yourself wanting to do real computation in a template, that is a signal the logic belongs in the view instead.
- **Mismatched context keys.** If your view passes `{'greeting': ...}` but the template references `{{ message }}`, Django does not raise an error — it silently renders an empty string. This "fails silently" behavior is convenient in production but can hide typos during development; setting `TEMPLATE_STRING_IF_INVALID` in `DEBUG` mode surfaces these mismatches instead of hiding them.
- **Overriding `{% block %}` names inconsistently.** If a child template's block name does not exactly match a block defined in the parent, Django simply ignores the mismatched content rather than raising an error.

### Views That Return JSON Instead of HTML

Not every view needs to render a template. When a view backs a JavaScript frontend or a mobile API instead of a full page, `JsonResponse` is the more appropriate tool:

```python
from django.http import JsonResponse
from .models import Task

def task_list_api(request):
    tasks = list(Task.objects.values('id', 'title', 'completed'))
    return JsonResponse({'tasks': tasks}, safe=False)
```

`.values()` returns dictionaries instead of model instances, which `JsonResponse` can serialize directly. This is the same view-layer concept as `render()` — take a request, return a response — but the response is data instead of markup. Choosing between the two is really a question of who consumes the response: a browser rendering a full page reaches for `render()` and a template; a frontend framework or external client fetching data reaches for `JsonResponse`.

---

### Conclusion

Django views and templates are integral to creating web pages and providing a user-friendly experience. Views handle the logic, while templates take care of the presentation. By mastering these two components — along with template inheritance, filters, static files, and the choice between HTML and JSON responses — you can craft dynamic, interactive web applications that stay maintainable as they grow.

In the next article, we'll explore how to connect Django views to models and databases, allowing us to build applications that can create, read, update, and delete data.

Stay tuned for more Django web development insights! Happy coding!