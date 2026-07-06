---
title: "What Is a Tuple in Python?"
description: "A beginner-friendly guide to Python tuples, exploring immutability, packing, unpacking, and exactly how they differ from lists."
date: "2022-12-13"
updated: "2022-12-13"
tags: ["python","programming","data-structures","coding-basics","backend"]
readTime: 4
image: "https://miro.medium.com/v2/resize:fit:720/format:webp/1*Kst3RGwEpCBKJKr7oRXiCQ.png"
author: "Murat Hüdavendigâr Öncü"
---
*In our previous article, we talked about lists in python. If you haven’t read it yet, you can read it by [clicking here](https://murathudavendigar.vercel.app/blogs/what-is-a-list-in-python).*

After understanding lists, the next fundamental data structure to master in Python is the tuple. At first glance, a tuple looks and behaves very similarly to a list. However, there is one massive difference that dictates exactly when and why you should use them.

### What is a Tuple?

A tuple is a collection of items that is ordered and **unchangeable** (immutable). Once you create a tuple, you cannot add, remove, or change its elements. You define a tuple by placing your items inside parentheses `()`, separated by commas.

```python
# A standard tuple
coordinates = (10, 20)

# A tuple with mixed data types
user_info = ("Murat", 28, True)

# A tuple with a single item (note the trailing comma)
single_item_tuple = ("apple",)
```

*Note: The trailing comma in a single-item tuple is mandatory. Without it, Python will simply treat the parentheses as a mathematical expression, and the variable will be evaluated as a simple string or integer rather than a tuple.*

### Why Use Tuples Instead of Lists?

You might be wondering: if tuples are just lists that I cannot change, why would I ever use them?

1. **Data Integrity:** If you have data that should never be altered throughout the lifecycle of your program (like configuration settings, days of the week, or geographic coordinates), putting them in a tuple guarantees that a bug in your code cannot accidentally modify them.
2. **Performance and Memory:** Because tuples are immutable, Python allocates a fixed block of memory for them. This makes them slightly faster and more memory-efficient than lists, especially when dealing with large amounts of static data.

3. **Dictionary Keys:** Because they are immutable, tuples are hashable. This means you can use a tuple as a key in a Python dictionary, which is something you cannot do with a mutable list.

### Accessing Tuple Elements

Just like lists, tuples are ordered, meaning you can access their items using zero-based indexing and negative indexing. You can also use slicing to extract a portion of the tuple.

```python
colors = ("red", "green", "blue", "yellow")

print(colors[1])   # Output: green
print(colors[-1])  # Output: yellow

# Slicing
print(colors[1:3]) # Output: ('green', 'blue')
```

If you try to modify an element, Python will immediately throw a `TypeError` to protect the data structure.

```python
colors[0] = "black" # Raises TypeError: 'tuple' object does not support item assignment
```

### Packing and Unpacking

One of the most powerful and common features of tuples in Python is packing and unpacking. When you create a tuple, you are 'packing' values into it. You can easily 'unpack' those values back into individual variables in a single line of code.

```python
# Packing
dimensions = (1920, 1080)

# Unpacking
width, height = dimensions

print(width)  # Output: 1920
print(height) # Output: 1080
```

This technique is heavily used when returning multiple values from a function. A function that returns multiple items separated by commas is actually returning a packed tuple under the hood.

### Built-in Tuple Methods

Because tuples cannot be modified, they only have two built-in methods:

- **count()**: Returns the number of times a specified value appears in the tuple.
- **index()**: Searches the tuple for a specified value and returns its position.

```python
numbers = (1, 3, 7, 8, 7, 5, 4, 6, 8, 5)

print(numbers.count(5))  # Output: 2
print(numbers.index(8))  # Output: 3 (returns the first occurrence)
```

### Conclusion

Tuples are the sturdy, reliable sibling of the Python list. While they lack the dynamic flexibility of lists, their immutability brings safety, performance benefits, and unique capabilities like dictionary key hashing. Knowing when to lock down your data with a tuple instead of a list is a clear sign of a maturing Python developer.

---

[Read the original full version on Medium](https://medium.com/stackademic/what-is-a-tuple-in-python-bae63f3c2cbc)