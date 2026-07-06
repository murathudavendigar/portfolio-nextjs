# Project : Portfolio Site

My portfolio site built with Next.js 15 (App Router), TypeScript, and TailwindCSS. Fully static — no database, no server-side runtime dependencies.

## Table of contents

- [Project : Portfolio Site](#project--portfolio-site)
  - [Table of contents](#table-of-contents)
  - [The challenge](#the-challenge)
  - [Stack](#stack)
  - [Project Skeleton](#project-skeleton)
  - [Adding a blog post](#adding-a-blog-post)
  - [Adding a project](#adding-a-project)
  - [Environment variables](#environment-variables)
  - [Screenshot](#screenshot)
  - [Links](#links)
    - [Built with](#built-with)
    - [Useful resources](#useful-resources)
  - [Installation](#installation)
  - [Author](#author)
  - [Contact](#contact)
  - [How to use](#how-to-use)

## The challenge

To create a portfolio site with React, Next.js, TypeScript and TailwindCSS.

## Stack

- **Next.js 15** — App Router, fully static (`○`/`●` routes, no server functions)
- **React 19**
- **TypeScript**
- **Tailwind CSS 3**
- Markdown blog — posts live as `.md` files in `content/blog/`, parsed at build time with `gray-matter`
- Project data lives in `data/projects.json`

## Project Skeleton

```
├── README.md
├── app
│   ├── blogs
│   │   ├── [slug]
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components
│   ├── About.tsx
│   ├── BackgroundCircles.tsx
│   ├── BlogCard.tsx
│   ├── Contact.tsx
│   ├── Experience.tsx
│   ├── ExperienceCard.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── MarkdownContent.tsx
│   ├── Projects.tsx
│   ├── Skill.tsx
│   └── Skills.tsx
├── content
│   └── blog
│       └── *.md
├── data
│   └── projects.json
├── lib
│   └── blog.ts
├── public
├── types
│   └── index.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Adding a blog post

Add a new post by dropping a Markdown file into `content/blog/` and pushing — no database, no ISR delay, the next deploy publishes it.

Each post needs frontmatter with these keys:

```md
---
title: "Post title"
description: "Short summary used on the blog list and for SEO."
date: "2026-07-07"
updated: "2026-07-07"
tags: ["tag-one", "tag-two"]
readTime: 5
image: "https://example.com/cover.jpg"
author: "Murat Hüdavendigâr Öncü"
---

Post content in Markdown goes here.
```

**`date` is required.** It's parsed with `new Date(data.date)` and used to sort posts newest-first. If it's missing, `Date` parsing produces `NaN`, and the post will sort unpredictably (and break the sort order for the rest of the list).

## Adding a project

Add or edit an entry in `data/projects.json`. No rebuild step beyond a normal deploy.

## Environment variables

The site only needs the EmailJS keys used by the contact form:

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
```

`MONGODB_URI` is no longer used — the site has no runtime database dependency.

## Screenshot

<p align="center">
<a href="https://www.muratoncu.com/"><img src="https://media.licdn.com/dms/image/C4D22AQG3wVzoU-Lvzg/feedshare-shrink_800/0/1674569569367?e=1677715200&v=beta&t=ROSec6PV0LGYVYNMPXWkZ5BUQlZY6o9lapMSYquenls" alt="screenshot"></a>
</p>

## Links

<hr>
<b>Check The Live Website ➡️</b> <a href="https://www.muratoncu.com/">Live Website</a>
<hr>

### Built with

- React Components, Props, States and Hooks
- TypeScript
- Next.js (App Router)
- React Hook Form
- JSX Elements
- TailwindCSS
- Framer Motion
- React Simple TypeWriter
- gray-matter / react-markdown (blog rendering)

### Useful resources

- [W3 Schools](https://www.w3schools.com/)
- [MDN](https://developer.mozilla.org/en-US/)
- [TailwindCSS](https://tailwindcss.com/)

## Installation

Use the Npm package manager install command.

```bash
npm install
```

---

## Author

- Author - [Murat Hüdavendigâr]

## Contact

<p align="center">
<a href="https://codepen.io/m_hudavendigar" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/codepen.svg" alt="m_hudavendigar" height="30" width="40" /></a>
<a href="https://twitter.com/murathoncu" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/twitter.svg" alt="murathoncu" height="30" width="40" /></a>
<a href="https://www.linkedin.com/in/murathudavendigaroncu/" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg" alt="murat-hüdavendigâr-öncü-232749246" height="30" width="40" /></a>
<a href="https://instagram.com/m_hdavendigr" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/instagram.svg" alt="m_hdavendigr" height="30" width="40" /></a>
  <a href="https://medium.com/@murathoncu" target="blank"><img align="center" src="https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/medium.svg" alt="@murathoncu" height="30" width="40" /></a>
</p>

## How to use

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

To build and run the production static build locally:

```bash
npm run build
npm run start
```
