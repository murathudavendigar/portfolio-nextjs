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

### Conclusion

Django views and templates are integral to creating web pages and providing a user-friendly experience. Views handle the logic, while templates take care of the presentation. By mastering these two components, you can craft dynamic, interactive web applications.

In the next article, we'll explore how to connect Django views to models and databases, allowing us to build applications that can create, read, update, and delete data.

Stay tuned for more Django web development insights! Happy coding!

---

[Read the original full version on Medium.](https://medium.com/python-in-plain-english/django-views-and-templates-crafting-web-pages-with-python-b40910aa7ed3)