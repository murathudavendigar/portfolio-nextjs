---
archived: true
title: "TypeScript: Understanding Interfaces and Types"
description: "The differences between interfaces and type aliases in TypeScript, with code examples and a simple rule for when to use each."
metaDescription: "The differences between interfaces and type aliases in TypeScript, with code examples and guidance on when to use each."
date: "2023-12-18"
updated: "2026-11-14"
tags: ["typescript","javascript","web-development","programming-tips","frontend"]
readTime: 6
image: ""
author: "Murat Hüdavendigâr Öncü"
---
Interface or type alias? It is one of the first questions people ask when they move from JavaScript to TypeScript. Most of the time either one works. The differences are small, but they decide which one fits a given job.

### The basics

Both describe the shape of your data.

A type alias is a name for any type: a primitive, a union, a tuple or an object.

```typescript
type UserID = string | number;
type Point = { x: number; y: number; };
```

An interface describes object shapes and class contracts, and nothing else.

```typescript
interface User {
  id: string;
  username: string;
  email: string;
}
```

### Where they differ

#### Declaration merging

Interfaces merge. Declare one with the same name twice and TypeScript combines them into one. That is how you add a field to a global or third-party type:

```typescript
interface Window {
  analyticsToken: string;
}

// Now the Window object has analyticsToken without errors
```

Types don't merge. Declaring the same type name twice is a compile error.

#### Unions

Types can be unions (this or that). Interfaces can't.

```typescript
type Status = "loading" | "success" | "error";
type RequestResult = SuccessResponse | ErrorResponse;
```

### Extending

Both can be extended, with different syntax. Interfaces use `extends`, which will look familiar if you come from Java or C#. Types use the intersection operator `&`.

```typescript
// Extending an Interface
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Intersecting a Type
type Person = {
  name: string;
};

type Employee = Person & {
  employeeId: number;
};
```

### Speed and error messages

The compiler used to check interfaces faster than type intersections. Newer versions have mostly closed that gap. Interfaces still tend to give clearer error messages, because the compiler can refer to them by name instead of printing the whole computed type.

### Which one to use

A simple rule that works for most code:

1. Interfaces for object shapes, class contracts and public APIs, because they can be extended and merged.
2. Types for unions, tuples and names for primitives.

### Using both together

Real code mixes them. A common case is an interface for a component's props and a type for the variants those props accept:

```typescript
type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant: ButtonVariant;
}
```

### Index signatures: objects with unknown keys

Sometimes you don't know the keys in advance, like translations keyed by locale code or a lookup table keyed by ID. Both interfaces and types support index signatures for that:

```typescript
interface StringDictionary {
  [key: string]: string;
}

type NumberDictionary = {
  [key: string]: number;
};

const translations: StringDictionary = {
  en: "Hello",
  tr: "Merhaba",
};
```

An index signature says: every property on this object, whatever its name, has this value type. Compare it with the `Status` union above, which lists a fixed set of values. Use an index signature when the set of keys is open, and a union when the set of values is closed.

### readonly

Both can mark a property `readonly`. The compiler enforces it, though, like every TypeScript check, not at runtime:

```typescript
interface Config {
  readonly apiUrl: string;
  timeout: number;
}

const config: Config = { apiUrl: "https://api.example.com", timeout: 5000 };
config.apiUrl = "https://evil.example.com"; // Error: Cannot assign to 'apiUrl' because it is a read-only property.
config.timeout = 3000; // fine, not marked readonly
```

It is a cheap way to say that a field, such as an ID, a creation time or a base URL, should never change after the object is created. No immutability library needed.

### Mapped types

Beyond the built-in utility types like `Partial` and `Pick`, you can write your own mapped types. They build a new type by applying a rule to every property of an existing one:

```typescript
interface User {
  id: string;
  username: string;
  email: string;
}

type ReadonlyUser = {
  readonly [K in keyof User]: User[K];
};

type OptionalUser = {
  [K in keyof User]?: User[K];
};
```

`keyof User` gives the union of `User`'s keys (`"id" | "username" | "email"`), and `[K in keyof User]` walks that union to build the new type one property at a time. `Partial<T>` and `Readonly<T>` are built exactly this way. Once you can read a mapped type, the built-in utility types stop looking like magic.

### Example: modeling an API response

Here is how the two usually combine in a real feature: fetching a user profile from an API that might fail.

```typescript
// Types for the closed set of possible request states
type RequestState = "idle" | "loading" | "success" | "error";

// Interface for the object shape returned on success
interface UserProfile {
  id: string;
  username: string;
  email: string;
}

// Type composing the interface into a union of possible results
type ProfileResult =
  | { state: "success"; data: UserProfile }
  | { state: "error"; message: string }
  | { state: "loading" | "idle" };

function renderProfile(result: ProfileResult) {
  if (result.state === "success") {
    console.log(result.data.username); // narrowed: TypeScript knows `data` exists here
  } else if (result.state === "error") {
    console.log(result.message); // narrowed: TypeScript knows `message` exists here
  }
}
```

This is a discriminated union: a shared field, here `state`, tells TypeScript which shape it is looking at. It is the most useful thing types can do that interfaces can't. It replaces a pile of optional fields and `undefined` checks with one structure the compiler checks for you.

### Common pitfalls

- **Trying to union two interfaces.** There is no `interface A | interface B`. Interfaces can be extended, not unioned. If you need a union, make it a type: `type Combined = A | B`.
- **Forgetting that merging still happens in the same scope.** Two interfaces with the same name in one module, or in a global declaration (a `declare global` block or a non-module `.d.ts` file), merge instead of raising an error. That is handy for extending third-party types, and confusing when it happens by accident. Two same-named interfaces in separate ES modules don't merge, since each module has its own scope.
- **Assuming `readonly` protects nested objects.** Like `Object.freeze()` in plain JavaScript, `readonly` only stops you from reassigning the property itself. If its value is an object, the fields inside stay mutable unless you mark them `readonly` too.

If you are unsure, start with an interface for anything shaped like an object, and switch to a type the moment you need a union.
