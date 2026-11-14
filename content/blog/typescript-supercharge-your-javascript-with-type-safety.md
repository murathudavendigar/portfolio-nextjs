---
archived: true
title: "Why I use TypeScript"
seoTitle: "TypeScript: Type Safety for JavaScript"
description: "How TypeScript adds static types to JavaScript: basic types, unions, generics, utility types and strict mode, and the mistakes people make when they adopt it."
date: "2023-10-16"
updated: "2026-11-14"
tags: ["typescript","javascript","web-development","frontend","programming"]
readTime: 6
image: ""
author: "Murat Hüdavendigâr Öncü"
---
JavaScript lets you pass anything anywhere. That is fine in a small script and painful once an app grows: the mistakes show up at runtime, in front of users. TypeScript is JavaScript with optional static types on top, so many of those mistakes show up in your editor instead.

In production React and Next.js apps I ship, TypeScript is non-negotiable. It catches the same class of bugs students hit when they first move from tutorials to real components. This post is the short "why and how" I give before we type a full feature.

### Why bother

If you have seen `TypeError: Cannot read properties of undefined` in production, you already know. TypeScript catches that kind of error while you write the code, before it reaches anyone.

- **Types:** a variable holds the kind of data you expect.
- **Editor help:** autocomplete and go-to-definition that actually know your code.
- **Refactoring:** rename or change something, and the compiler lists every place that broke.

### Basic types

```typescript
// Defining basic types
let username: string = "muratoncu";
let age: number = 28;
let isDeveloper: boolean = true;
```

### Typing functions

Passing the wrong arguments to a function is one of the most common JavaScript bugs. TypeScript checks parameter and return types:

```typescript
// Function with typed parameters and a typed return value
function greetUser(name: string, age: number): string {
  return `Hello ${name}, you are ${age} years old!`;
}

greetUser("Murat", 28); // Works
// greetUser("Murat", "28"); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
```

### Interfaces and custom types

You can describe the shape of an object with an interface or a type. I compare the two in [Understanding Interfaces and Types](/writing/typescript-understanding-interfaces-and-types). This is where TypeScript starts to model your actual data:

```typescript
interface User {
  id: number;
  name: string;
  isActive: boolean;
}

const fetchUser = (id: number): User => {
  // Imagine fetching data from an API here
  return { id, name: "Murat", isActive: true };
};
```

### Unions and narrowing

Real data is often one of several types. A function might take a `string` or a `number`, and an API might return a success payload or an error. A union type, written with a pipe, says exactly that:

```typescript
function formatId(id: string | number): string {
  return `ID-${id}`;
}
```

Before you use a union value in a type-specific way, you narrow it with a runtime check:

```typescript
function printLength(value: string | string[]) {
  if (typeof value === "string") {
    console.log(value.length); // TypeScript knows value is a string here
  } else {
    console.log(value.length); // TypeScript knows value is a string[] here
  }
}
```

The compiler follows the `typeof` check and narrows the type in each branch. So you can't call a string-only method on something that might be an array: the compiler stops you before the code runs.

### Generics

Without generics, a reusable helper either loses its types (falls back to `any`) or gets copied once per type. A generic takes a type parameter that is filled in where you call it:

```typescript
function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}

const firstNumber = firstItem([1, 2, 3]);       // inferred as number | undefined
const firstName = firstItem(["Murat", "Ada"]);  // inferred as string | undefined
```

TypeScript fills in `T` from what you pass. No `any`, no copies, and the return type is still checked. You use generics all the time without noticing: React's `useState<T>()`, array methods and most data-fetching helpers are generic for this reason.

### Utility types

TypeScript comes with utility types that reshape an existing type instead of making you write a new one. With the `User` interface from above:

```typescript
interface User {
  id: number;
  name: string;
  isActive: boolean;
}

type PartialUser = Partial<User>;      // every field becomes optional, useful for update payloads
type UserPreview = Pick<User, "id" | "name">;  // only id and name
type UserWithoutId = Omit<User, "id">; // everything except id
```

`Partial<User>` shows up most in update functions. A `PATCH /users/:id` endpoint accepts any subset of fields, and `Partial<User>` says exactly that without a second interface to keep in sync.

```typescript
function updateUser(id: number, changes: Partial<User>) {
  // changes might contain just { isActive: false }, or any subset of User's fields
}
```

### Turn on strict mode

Without configuration, TypeScript lets a lot through, including implicit `any` on untyped parameters. The one setting that matters most in `tsconfig.json` is `strict`:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

`strict` turns on several checks. The two that matter most are `strictNullChecks`, which makes you handle `null` and `undefined` instead of assuming a value is there, and `noImplicitAny`, which errors when TypeScript can't infer a parameter's type instead of quietly treating it as `any`. On a new project it costs nothing. On an existing codebase it can surface a lot of hidden bugs at once, which is the point.

### Common mistakes when adopting TypeScript

- **Using `any` to make errors go away.** `any` turns off type checking for that value. It is an escape hatch, not a type. If you reach for it every time the compiler complains, you lose the reason you adopted TypeScript. When you really don't know the type yet, use `unknown`: it makes you narrow before you use the value.
- **Trusting `JSON.parse()`.** `JSON.parse()` returns `any`, and TypeScript can't check that the JSON matches the shape you cast it to. `as User` validates nothing at runtime, so a wrong API response passes the type checker and still breaks in production. At that boundary, add a runtime validation library.
- **Mixing up compile time and runtime.** Types are erased when TypeScript compiles to JavaScript. There is no `typeof user === "User"` at runtime, because interfaces don't exist after compilation. TypeScript stops you from writing code that breaks its rules, but it can't stop bad data coming from outside: an API, `localStorage`, user input.
- **Widening literal types by accident.** `let status = "active"` is inferred as `string`, not as the literal `"active"`. If a variable should only hold certain values, say so: `let status: "active" | "inactive" = "active"`. Otherwise it accepts any string, and the compiler only notices when the value reaches stricter code.

### TypeScript vs. JSDoc comments

If your team can't add a TypeScript build step yet, JSDoc gets you part of the way. Editors like VS Code read JSDoc annotations in plain `.js` files and give you autocomplete and basic type checks:

```javascript
/**
 * @param {string} name
 * @param {number} age
 * @returns {string}
 */
function greetUser(name, age) {
  return `Hello ${name}, you are ${age} years old!`;
}
```

It is a reasonable step for an older JavaScript codebase that can't rename every file at once. But you don't get generics, utility types, or a `tsconfig.json` with `strict` mode. Use JSDoc as a bridge, not a replacement.

If you adopt only one thing from this post, make it `"strict": true` on day one. Adding it later is always harder.
