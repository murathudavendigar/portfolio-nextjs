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
*In our previous article, we talked about tuples in Python. If you haven’t read it yet, you can read it by [clicking here](/writing/what-is-a-tuple-in-python).*

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

### Checking Whether a Key Exists

Before reading a value, you often need to know whether a key is even present. The `in` keyword checks key membership directly, without needing `.get()`:

```python
user = {"username": "muratoncu", "age": 29}

if "username" in user:
    print("Username is set")

if "email" not in user:
    print("No email on file")
```

`in` only checks **keys** by default, not values — `"muratoncu" in user` would be `False`, because that string is a value, not a key. To check whether a value exists anywhere in the dictionary, you'd check `"muratoncu" in user.values()` instead.

### Dictionary Comprehensions

Just as Python has list comprehensions, it has **dictionary comprehensions** — a compact way to build a dictionary from an iterable in a single line, instead of writing a `for` loop with manual key assignment.

```python
# The verbose way
squares = {}
for n in range(1, 6):
    squares[n] = n ** 2

# The comprehension way — identical result
squares = {n: n ** 2 for n in range(1, 6)}
print(squares)  # {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
```

Comprehensions can also filter, and they're commonly used to transform an existing dictionary — for example, keeping only students who passed:

```python
grades = {"Math": 90, "Science": 55, "History": 88}
passing = {subject: grade for subject, grade in grades.items() if grade >= 60}
print(passing)  # {'Math': 90, 'History': 88}
```

### How Do You Merge Two Dictionaries?

Combining dictionaries comes up constantly — merging default settings with user overrides, for example. The `.update()` method merges one dictionary into another in place:

```python
defaults = {"theme": "light", "font_size": 14}
user_prefs = {"font_size": 18}

defaults.update(user_prefs)
print(defaults)  # {'theme': 'light', 'font_size': 18}
```

Note that `.update()` mutates `defaults` directly — if you need a new dictionary without touching either original, Python 3.9+ offers the merge operator `|`, which returns a brand-new dictionary:

```python
defaults = {"theme": "light", "font_size": 14}
user_prefs = {"font_size": 18}

merged = defaults | user_prefs
print(merged)     # {'theme': 'light', 'font_size': 18}
print(defaults)   # unchanged: {'theme': 'light', 'font_size': 14}
```

In both cases, when the same key appears in both dictionaries, the value from the **second** (or right-hand) dictionary wins.

### Nested Dictionaries

Dictionary values can themselves be dictionaries, which is how you model structured, hierarchical data — a common shape for JSON responses from web APIs:

```python
company = {
    "name": "TemCraft Tech",
    "address": {
        "city": "Istanbul",
        "country": "Turkey"
    },
    "employees": [
        {"name": "Murat", "role": "Developer"},
        {"name": "Ada", "role": "Designer"}
    ]
}

print(company["address"]["city"])          # Istanbul
print(company["employees"][0]["name"])     # Murat
```

Reading nested data means chaining key and index access. If you're not certain a nested key exists, chaining `.get()` calls avoids a `KeyError` mid-lookup: `company.get("address", {}).get("zip_code", "Unknown")` safely returns `"Unknown"` even if `"address"` or `"zip_code"` is missing, because each `.get()` falls back to an empty dictionary or a default value rather than raising.

### Dictionaries vs. Lists: When Should You Use Which?

Both store collections of data, but they solve different problems:

- **Use a list** when order and position matter, and you'll access items primarily by their position (`items[0]`, `items[-1]`) or iterate over all of them in sequence.
- **Use a dictionary** when you need to look something up by a meaningful name or ID rather than a position — a user by username, a config value by setting name, a count by category.

The practical difference that matters most: looking up a value in a dictionary by key is a constant-time operation on average, regardless of how many entries the dictionary holds, because Python implements dictionaries as hash tables. Searching for a value in a list (`if x in my_list`) has to check items one at a time until it finds a match, so it gets slower as the list grows. If your code frequently asks "do I have an entry for X?", a dictionary is almost always the right structure.

### Common Pitfalls with Dictionaries

- **Using square-bracket access instead of `.get()` for optional keys.** `user["email"]` crashes with a `KeyError` the moment the key is absent. Any time a key's presence isn't guaranteed, `.get()` is the safer default.
- **Assuming dictionary keys can be any type.** Dictionary keys must be hashable — strings, numbers, and tuples work; lists and other dictionaries do not, and using one as a key raises a `TypeError: unhashable type`.
- **Mutating a dictionary while iterating over it.** Adding or removing keys inside a `for key in my_dict:` loop raises a `RuntimeError: dictionary changed size during iteration`. If you need to modify a dictionary while looping, iterate over a copy of its keys instead: `for key in list(my_dict.keys()):`.
- **Forgetting that `.pop()` without a default raises if the key is missing.** `user.pop("location")` throws `KeyError` if `"location"` was never set. `user.pop("location", None)` returns `None` instead of crashing, mirroring how `.get()` handles missing keys on read.

### Conclusion

Dictionaries are essential whenever you need to map one piece of information to another. They are incredibly fast for looking up data and form the backbone of many complex operations in Python, including working with JSON data from web APIs. Master the dictionary — key access, comprehensions, merging, and nested structures — and you will unlock a whole new level of problem-solving in your code.