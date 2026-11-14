---
archived: true
title: "React hooks: the patterns I teach most"
seoTitle: "React Hooks: Strategies and Custom Hooks"
description: "How the core React hooks work, when useMemo and useCallback actually help, how to write custom hooks like useFetch and useDebounce, and the stale closure bug."
metaDescription: "A guide to React Hooks: how they work, when useMemo and useCallback help performance, and how to build reusable custom hooks."
date: "2024-01-10"
updated: "2026-11-14"
tags: ["react","javascript","web-development","hooks","frontend"]
readTime: 8
image: ""
author: "Murat Hüdavendigâr Öncü"
---
Hooks let function components hold state and run side effects without a class, and they are how React is written now. Knowing what each hook does is the easy part. The harder part is knowing when to use which, and when to pull logic out into a hook of your own.

When I teach React to new frontend developers, hooks are the first place confusion shows up, especially `useEffect` dependency arrays and "when do I need a custom hook?" This post collects the patterns I repeat most often in class and in production Next.js work at TemCraft Tech.

### The core hooks, past the basics

Most people start with `useState` and `useEffect`. Both look simple, and both have details that cause real bugs.

#### useState

`useState` adds state to a function component. The common mistake is not using the functional update when the new state depends on the old one:

```javascript
// Instead of this:
setCount(count + 1);

// Use this so rapid updates don't overwrite each other:
setCount(prevCount => prevCount + 1);
```

#### useEffect

`useEffect` is for side effects: API calls, subscriptions, manual DOM work. The dependency array decides when it runs. Leave it out and the effect runs after every render. Pass `[]` and it runs once on mount. List variables and it runs whenever one of them changes.

Return a cleanup function whenever you start something that keeps running, like a timer or an event listener. Otherwise it leaks:

```javascript
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  return () => clearInterval(timer); // Cleanup
}, []);
```

### useMemo and useCallback

These two exist to skip work React would otherwise repeat on every render.

- `useMemo` remembers a computed value. Use it for an expensive calculation that doesn't need to run every render.
- `useCallback` remembers a function. Use it when you pass a function to a child wrapped in `React.memo`, so the child doesn't re-render just because it got a new function.

Don't wrap everything in them. They have their own cost. Use them when you can see a slow spot, or when the value goes into another hook's dependency array.

`React.memo` is the third piece, and the three get mixed up a lot:

| Tool | Remembers | Use it when |
|---|---|---|
| `useMemo` | A computed value | An expensive calculation shouldn't re-run every render |
| `useCallback` | A function reference | You pass a callback prop to a memoized child |
| `React.memo` | A whole component | A component re-renders with the same props too often |

They only work together. `React.memo` skips a re-render only if the props are the same as last time, and `useCallback` (for functions) and `useMemo` (for objects and arrays) are what keep them the same.

### useRef and useContext

Two more hooks show up in almost every real component.

`useRef` gives you a box that survives re-renders and does not cause one when you change it. That is the difference from `useState`. You use it to hold a DOM node, or any value that should stick around between renders without triggering a new one.

```javascript
function TextInputWithFocusButton() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus the input</button>
    </>
  );
}
```

`useContext` fixes prop drilling: passing a prop through five components that don't use it, just so a deeply nested child can. A provider makes a value available to every descendant that asks for it:

```javascript
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext); // no props passed through Toolbar at all
  return <div className={`toolbar-${theme}`}>...</div>;
}
```

Use context for values that really belong to a whole subtree, like the theme, the signed-in user or the locale. For everything else, passing props is still simpler and easier to follow.

### Custom hooks

A custom hook is a plain function whose name starts with `use` and that calls other hooks. It lets you move logic out of a component so the component can focus on what it renders.

Why bother:

1. **Reuse:** the same logic in several components, written once.
2. **Testing:** you can test the logic without the UI.
3. **Smaller components:** the complicated part moves out of the component body.

### Example: useFetch

A hook that fetches data and tracks loading and errors:

```javascript
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
```

Using it:

```javascript
const { data, loading, error } = useFetch('https://api.example.com/items');

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error}</p>;

return <div>{/* Render your data here */}</div>;
```

### Example: useDebounce

A lot of UI work is reacting to input that changes fast. A search box shouldn't call the API on every keystroke. `useDebounce` is the usual answer:

```javascript
import { useState, useEffect } from 'react';

function useDebounce(value, delayMs) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(timer); // cancel if value changes before delay elapses
  }, [value, delayMs]);

  return debouncedValue;
}
```

In a search box, the input stays responsive and the API call waits until the user stops typing:

```javascript
function SearchBox() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery) return;
    fetch(`/api/search?q=${debouncedQuery}`);
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

`query` changes on every keystroke. `debouncedQuery` only catches up 400ms after typing stops, because each keystroke's cleanup cancels the previous `setTimeout` before it fires.

### The stale closure bug

The most confusing bug in hooks code is the stale closure: an effect or callback that captured a value from the render it was created in, and keeps using that old value after state has changed.

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count); // always logs 0, no matter how many times count changes
    }, 1000);

    return () => clearInterval(timer);
  }, []); // empty array means this effect (and its closure over `count`) runs once, forever

  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}
```

The dependency array is `[]`, so the effect runs once, and the function inside it holds on to `count` from the first render: `0`. The number on screen goes up with every click. The `console.log` never sees it.

There are two fixes. Add `count` to the dependency array, which restarts the interval on every change. Or, more often, use the functional update so the callback doesn't read the old variable at all:

```javascript
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prevCount => prevCount + 1); // reads current state via the updater, not the closure
  }, 1000);

  return () => clearInterval(timer);
}, []);
```

That is the same functional update from the `useState` section, and not by accident. Hooks see the values from the render they were created in. Once that clicks, stale closures become something you check for: any effect that reads state without listing it as a dependency.

### Rules worth keeping

- **Rules of Hooks:** call hooks only at the top level, never inside loops, conditions or nested functions, and only from components or other hooks.
- **One job per hook:** if a custom hook does too much, split it.
- **Honest dependency arrays:** list what the effect reads. The `eslint-plugin-react-hooks` lint rule catches the ones you miss.

If your effect reads a value, that value belongs in the dependency array. A lot of hooks bugs come back to that one rule.
