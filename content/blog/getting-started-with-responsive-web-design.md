---
archived: true
title: "Getting Started with Responsive Web Design"
description: "A beginner-friendly guide to responsive web design in 2026, covering fluid grids, flexible images, media queries, and CSS Grid with real code examples."
date: "2026-02-26"
updated: "2026-11-14"
tags: ["css","responsive design","web design","frontend","html"]
readTime: 7
image: ""
author: "Murat Hüdavendigâr Öncü"
---
People open websites on foldable phones, ultra-wide monitors and everything in between. A site that only works at one width is broken for a lot of them. Responsive web design is the baseline now, not an extra.

I use the same order with students: fluid layout first, then flexible media, then breakpoints, and only after that a framework like Tailwind. This post follows that order, with code you can paste and try.

---

## What responsive web design means

The layout adapts to whatever screen it lands on. One codebase, every device.

It rests on three things:

| Piece | What it does |
|---|---|
| Fluid grids | Size elements with relative units instead of fixed pixels |
| Flexible images | Keep media inside its container |
| Media queries | Apply different styles depending on the screen |

---

## Fluid grids

A fluid grid uses relative units like percentages instead of fixed pixel values, so elements resize with the screen.

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.column {
  float: left;
  width: 50%;
  padding: 10px;
  box-sizing: border-box;
}

@media (max-width: 600px) {
  .column {
    width: 100%;
    float: none;
  }
}
```

On a wide screen the two columns sit side by side. On a phone they stack and each takes the full width.

---

## Flexible images

An image that doesn't scale either overflows its container or looks tiny on a big screen. The fix is three lines:

```css
img {
  max-width: 100%;
  height: auto;
  display: block;
}
```

Add `srcset` so the browser can pick a file that fits the screen:

```html
<img
  src="photo-800.jpg"
  srcset="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 900px) 800px, 1200px"
  alt="A responsive image example"
/>
```

Now a phone doesn't download a 4K image to show it 400px wide. While you're at it, use WebP or AVIF instead of JPEG or PNG. The files are much smaller at the same quality.

---

## Media queries

A media query applies CSS only when a condition is true. Most of the time the condition is the screen width.

```css
/* Large desktops */
@media (max-width: 1200px) {
  /* styles here */
}

/* Tablets */
@media (max-width: 768px) {
  /* styles here */
}

/* Mobile phones */
@media (max-width: 480px) {
  /* styles here */
}
```

You can also ask about orientation and dark mode:

```css
/* Landscape orientation */
@media (orientation: landscape) {
  /* styles here */
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #121212;
    color: #f1f1f1;
  }
}
```

---

## A full layout with CSS Grid

Here is everything together in one page layout.

### Step 1: HTML structure

```html
<div class="container">
  <header>Header</header>
  <nav>Navigation</nav>
  <main>Main Content</main>
  <aside>Sidebar</aside>
  <footer>Footer</footer>
</div>
```

### Step 2: Desktop layout

```css
.container {
  display: grid;
  grid-template-areas:
    'header header'
    'nav    main'
    'aside  main'
    'footer footer';
  grid-template-columns: 250px 1fr;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header { grid-area: header; background: #f0f0f0; padding: 20px; }
nav    { grid-area: nav;    background: #e0e0e0; padding: 16px; }
main   { grid-area: main;   background: #fff;    padding: 24px; }
aside  { grid-area: aside;  background: #e8e8e8; padding: 16px; }
footer { grid-area: footer; background: #f0f0f0; padding: 20px; text-align: center; }
```

### Step 3: Mobile layout

```css
@media (max-width: 768px) {
  .container {
    grid-template-areas:
      'header'
      'nav'
      'main'
      'aside'
      'footer';
    grid-template-columns: 1fr;
  }
}
```

Desktop gets two columns, a phone gets one. No JavaScript.

---

## Mobile-first

Most projects now start from the phone: base styles for small screens, then `min-width` queries that add to them as the screen grows.

```css
/* Base: mobile */
.column {
  width: 100%;
}

/* Tablet and up */
@media (min-width: 600px) {
  .column {
    width: 50%;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .column {
    width: 33.33%;
  }
}
```

Starting small makes you decide what matters first. The stylesheets usually come out shorter, too.

---

## Fluid type with clamp()

Breakpoints work for layout, but font sizes that jump at each breakpoint look odd. `clamp()` scales a value smoothly between a minimum and a maximum, based on the viewport width, without any media query:

```css
h1 {
  /* min: 1.75rem, preferred: 4vw, max: 3.5rem */
  font-size: clamp(1.75rem, 4vw, 3.5rem);
}

p {
  font-size: clamp(1rem, 1.5vw, 1.125rem);
}
```

`clamp(min, preferred, max)` takes the smallest size allowed, a fluid preferred value (usually in `vw`), and the largest size allowed. The browser fills in everything between. It is the usual way to size headings now.

---

## Container queries

Media queries look at the viewport. A component like a card often cares about its own container instead. The same card can sit in a wide main area on one page and a narrow sidebar on another, and it needs different styles in each, whatever the screen width.

Container queries handle that. First, mark an element as a container:

```css
.card-grid {
  container-type: inline-size;
  container-name: card-grid;
}
```

Then query the container instead of the viewport:

```css
.card {
  display: flex;
  flex-direction: column;
}

@container card-grid (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
```

The card now switches to a side-by-side layout whenever its container is at least 400px wide, in the main area or in a sidebar. For components you reuse in places you can't predict, that's a real step up from media queries.

**Which one to use**

| Use case | Use |
|---|---|
| Page layout (nav, overall grid, header and footer) | Media queries |
| A component that shows up in containers of different widths | Container queries |
| Global preferences (dark mode, reduced motion, print) | Media queries |

They work together. Most stylesheets use media queries for the page shell and container queries for the components inside it.

---

## Common pitfalls

- **Forgetting the viewport meta tag.** Without `<meta name="viewport" content="width=device-width, initial-scale=1">` in the `<head>`, mobile browsers render the page at desktop width and zoom out. Your `max-width: 768px` queries never fire on a real phone, even though they look right in DevTools.
- **Mixing `max-width` and `min-width` breakpoints.** Desktop-first rules in one file and mobile-first rules in another end in specificity fights, where the winner depends on load order. Pick one direction per project.
- **Testing only in the emulator.** DevTools' responsive mode is a good first check, but it doesn't reproduce touch targets, real networks or the OS font size. Tap targets that are too small and text that overflows at a large system font only show up on real hardware.
- **Using `vh` for full-height sections on mobile.** In mobile Safari and Chrome, `100vh` includes the space the address bar sometimes covers, so content gets cut off or overflows when the bar shows and hides. `100dvh` was added to fix exactly this.
- **Testing with tidy placeholder text.** A layout that looks perfect with three short words breaks on a long product name or a translated string. Test your breakpoints with real, worst-case content, not lorem ipsum.

---

## Checklist

- [x] Use `%`, `em`, `rem`, or `vw`/`vh` instead of fixed `px` for layout
- [x] Set `max-width: 100%` on images and videos
- [x] Start with mobile styles
- [x] Use CSS Grid or Flexbox instead of floats for layout
- [x] Use SVG for icons and logos, so they stay sharp at any size
- [x] Check layouts in DevTools' responsive mode
- [x] Check on a real phone, not only the emulator
- [x] Compress images, minify CSS and lazy-load what's below the fold

---

## Tools

**Testing**
- Chrome and Firefox DevTools, responsive mode
- [Responsively App](https://responsively.app) shows several screen sizes at once

**Frameworks**
- Tailwind CSS: utility classes, mobile-first by default
- Bootstrap 5: an established grid and component set

**Images**
- [Squoosh](https://squoosh.app) compresses and converts images to WebP or AVIF
- [SVGOMG](https://jakearchibald.github.io/svgomg/) optimizes SVG files

If you only remember one rule from this post, make it the viewport meta tag. Without it, nothing else here works on a phone.
