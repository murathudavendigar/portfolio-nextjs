---
archived: true
title: "JavaScript Objects Don’t Have to Be Complicated"
description: "A beginner's guide to JavaScript objects: keys and values, dot and bracket notation, destructuring, copying, looping, Map, and the usual mistakes."
date: "2025-10-01"
updated: "2026-11-14"
tags: ["javascript","programming","web development","coding tips"]
readTime: 4
image: ""
author: "Murat Hüdavendigâr Öncü"
---
Objects look like a big topic when you start JavaScript. They aren't. An object groups related data, and sometimes functions, under one name, so you don't have a pile of separate variables describing the same thing.

### What an object is

An object is a set of properties. Each property is a name (the key) and a value. You write one with curly braces:

```javascript
const user = {
  firstName: 'Murat',
  lastName: 'Oncu',
  age: 28,
  isDeveloper: true
};
```

Here `firstName` is a key and `'Murat'` is its value. Everything about this user sits in one place.

### Reading and changing values

Most of the time you use dot notation. To change a value, assign to it like a normal variable:

```javascript
// Accessing a property
console.log(user.firstName); // Output: Murat

// Updating a property
user.age = 29;

// Adding a new property
user.location = 'Istanbul';
```

### Why objects matter

Picture an online store without objects: one array of names, one of prices, one of descriptions, and you keep them lined up by hand. With objects, each product is one thing with a name, a price and a description.

- **Room to grow:** add a field when you need it.
- **Clear names:** the key tells you what each value is.
- **Methods:** an object can hold functions too, so it can do things as well as store data.

```javascript
const calculator = {
  owner: 'Murat',
  add: function(a, b) {
    return a + b;
  }
};

console.log(calculator.add(5, 10)); // Output: 15
```

### Bracket notation

Dot notation (`user.firstName`) only works when you know the key while writing the code and it is a valid identifier. When the key only exists at runtime, for example a form field name from user input, use brackets:

```javascript
const fieldName = 'age'; // could come from a variable, a loop, an API response

console.log(user[fieldName]);  // Output: 29
user[fieldName] = 30;
```

Brackets also handle keys that aren't valid identifiers, like keys with a dash or that start with a number:

```javascript
const config = {
  'api-key': 'abc123',
  '2fa-enabled': true,
};

console.log(config['api-key']); // dot notation (config.api-key) would be a syntax error here
```

So: dot notation when you know the exact key, brackets when the key is dynamic or not a valid identifier.

### Nested objects and destructuring

Real data is rarely flat. Objects hold other objects, and you reach inside by chaining:

```javascript
const user = {
  firstName: 'Murat',
  address: {
    city: 'Istanbul',
    country: 'Turkey',
  },
};

console.log(user.address.city); // Output: Istanbul
```

Writing `user.address.` again and again gets long. Destructuring pulls values out into variables in one line:

```javascript
const { firstName, address: { city, country } } = user;

console.log(firstName); // Murat
console.log(city);      // Istanbul
```

You will see this all over React and Node.js code. Function parameters are often objects, and destructuring them in the signature keeps the function body short:

```javascript
function printProfile({ firstName, address: { city } }) {
  console.log(`${firstName} lives in ${city}`);
}
```

### Copying objects

A variable that holds an object holds a reference to it, not a copy. Assign it to another variable and both names point at the same object:

```javascript
const original = { score: 10 };
const copy = original;

copy.score = 99;

console.log(original.score); // Output: 99 — "original" changed too!
```

To get a separate copy, use the spread operator:

```javascript
const original = { score: 10 };
const copy = { ...original };

copy.score = 99;

console.log(original.score); // Output: 10 — unaffected
```

Spread only copies one level deep. If a value is itself an object, that inner object is still shared:

```javascript
const original = { score: 10, meta: { level: 1 } };
const copy = { ...original };

copy.meta.level = 2;

console.log(original.meta.level); // Output: 2 — still shared!
```

For a full deep copy, either spread each level by hand or call `structuredClone(original)`. It works in all modern browsers and in Node.js.

### Looping over an object

Arrays have `.map()` and `.filter()`. Plain objects don't, so you turn the object into an array first:

```javascript
const user = { firstName: 'Murat', age: 29, isDeveloper: true };

Object.keys(user);    // ['firstName', 'age', 'isDeveloper']
Object.values(user);  // ['Murat', 29, true]
Object.entries(user); // [['firstName', 'Murat'], ['age', 29], ['isDeveloper', true]]
```

`Object.entries()` with `map()` or a `for...of` loop is the usual way to show an object's data:

```javascript
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`);
}
```

### Objects or Map?

JavaScript also has `Map`. When should you use it instead of a plain object?

- **A plain object** when the keys are strings you know in advance and the data has a fixed shape: a user profile, a config, an API response you're about to `JSON.stringify()`.
- **A `Map`** when keys come and go at runtime, when keys aren't strings (objects, or numbers that should stay numbers), or when you want `.size` and insertion-order iteration without going through `Object.keys()`.

```javascript
const scoresByPlayer = new Map();
scoresByPlayer.set(playerObject, 42); // object as key — not possible with plain objects
console.log(scoresByPlayer.size);     // built-in size, no Object.keys().length needed
```

For everyday data like records, settings and API payloads, a plain object is still the default. Use `Map` when what you are building is really a lookup table.

### Common mistakes

- **Comparing objects with `===`.** Two objects with the same properties are never `===` equal, because `===` checks whether they are the same object, not whether they look the same: `{ a: 1 } === { a: 1 }` is `false`. Compare specific fields, or use `JSON.stringify()` for simple cases (key order matters there).
- **Thinking `const` makes an object read-only.** `const user = {...}` stops you from reassigning `user`, but every property inside can still change. If you need it frozen, use `Object.freeze(user)`.
- **Reading a nested property that might not exist.** `user.address.city` throws a `TypeError` if `address` is `undefined`. Optional chaining, `user.address?.city`, gives `undefined` instead of crashing.

If an object changes when you didn't touch it, look for a copy that was really a reference. It is one of the most common mistakes with objects.
