---
title: "What Is a Dictionary in Python?"
description: "A complete beginner's guide to Python dictionaries, exploring key-value pairs, safe data retrieval, and essential dictionary methods."
date: "2022-12-17"
updated: "2022-12-17"
tags: ["python","programming","data-structures","coding-basics","backend"]
readTime: 5
image: "https://images.shiksha.com/mediadata/images/articles/1723098997phpe4XpdY.jpeg"
author: "Murat Hüdavendigâr Öncü"
---
*In our previous article, we talked about tuples in Python. If you haven’t read it yet, you can read it by [clicking here](https://www.muratoncu.com/blogs/what-is-a-tuple-in-python).*

Now that you understand lists and tuples, it is time to meet one of the most powerful and widely used data structures in Python: the dictionary. While lists and tuples organize data by their position (index), dictionaries organize data by association. 

### What is a Dictionary?

Think of a real-world dictionary. You do not look up a word by finding the '500th word in the book'; you look it up by its name. A Python dictionary works exactly the same way. It is a collection of `key: value` pairs. 

Dictionaries are mutable (you can change them) and, as of Python 3.7, they maintain the order in which items were inserted. You define a dictionary using curly braces `{}`.



```python
# A dictionary representing a user profile
user = {
    "username": "muratoncu",
    "age": 28,
    "is_active": True,
    "roles": ["admin", "editor"]
}
```

In this example, `"username"`, `"age"`, `"is_active"`, and `"roles"` are the **keys**. The data associated with them are the **values**.

### Accessing Data in a Dictionary

Because dictionaries are not indexed by numbers, you access a value by referring to its key name inside square brackets.

```python
print(user["username"])  # Output: muratoncu
print(user["age"])       # Output: 28
```

However, there is a safer way to access data. If you try to access a key that does not exist using square brackets, Python will throw a `KeyError` and crash your program. To prevent this, use the `.get()` method. It returns `None` (or a default value of your choice) if the key is missing.

```python
# Using .get() prevents errors
print(user.get("email"))  # Output: None

# You can also provide a default fallback value
print(user.get("email", "Not Provided"))  # Output: Not Provided
```

### Adding and Modifying Data

Updating a dictionary is incredibly straightforward. You simply assign a value to a key. If the key already exists, the value gets updated. If the key does not exist, a new key-value pair is added to the dictionary.

```python
# Modifying an existing key
user["age"] = 29

# Adding a new key-value pair
user["location"] = "Istanbul"

print(user)
# Output: {'username': 'muratoncu', 'age': 29, 'is_active': True, 'roles': ['admin', 'editor'], 'location': 'Istanbul'}
```

### Removing Data

Python gives you several ways to remove items from a dictionary:

1. **pop()**: Removes the item with the specified key name and returns its value.
2. **del**: A keyword that deletes the item with the specified key name entirely.
3. **clear()**: Empties the entire dictionary.

```python
# Using pop()
removed_location = user.pop("location")
print(removed_location)  # Output: Istanbul

# Using del
del user["is_active"]
```

### Looping Through a Dictionary

Dictionaries are fantastic for iterating, but you have to decide whether you want to loop through the keys, the values, or both simultaneously.

```python
student_grades = {"Math": 90, "Science": 85, "History": 88}

# Loop through keys only (default behavior)
for subject in student_grades:
    print(subject)

# Loop through values only
for grade in student_grades.values():
    print(grade)

# Loop through both keys and values using .items()
for subject, grade in student_grades.items():
    print(f"Subject: {subject}, Grade: {grade}")
```

### Conclusion

Dictionaries are essential whenever you need to map one piece of information to another. They are incredibly fast for looking up data and form the backbone of many complex operations in Python, including working with JSON data from web APIs. Master the dictionary, and you will unlock a whole new level of problem-solving in your code.