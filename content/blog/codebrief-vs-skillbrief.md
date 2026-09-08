---
title: "Always-On Context vs On-Demand Skills"
description: "codebrief writes what a repo is. skillbrief writes how to work in it. Why I shipped two zero-dependency CLIs instead of stuffing one rules file with everything an agent might need."
date: "2026-09-08"
tags: ["nodejs", "typescript", "cli", "agents", "cursor"]
readTime: 6
image: ""
author: "Murat Hüdavendigâr Öncü"
---

codebrief is an npm CLI that writes always-on project context — `CONTEXT.md`, Cursor rules, and GitHub Copilot instructions — so an agent knows what a repository is. skillbrief is a second CLI that writes Agent Skills (`SKILL.md`) from the same repo, so the agent loads *how* to work in it only when the task matches. I shipped both with zero npm runtime dependencies, then ran them on this site before I asked anyone else to try them.

I did not start with two packages. I started with one messy rules file.

## The file that kept getting longer

Once you give an agent a repo, it needs two different kinds of knowledge. The first is identity: this is a Next.js App Router app, the package manager is npm, work lives in `data/projects.json`, the theme inversion is load-bearing. The second is procedure: how you add a page, where tests go, which command to run, what not to invent.

Those two things look similar in a text file. They are not the same job.

Always-on context belongs in every conversation. If the model does not know the stack, it will invent a second catalog, suggest yarn, or “fix” the charcoal/paper theme by swapping body classes. Procedure does not belong in every conversation. You do not need a testing skill while someone is rewriting a sentence on the About page. You do not need a UI skill to bump a date in a markdown file.

I kept stuffing both into one Cursor rules file anyway, because one file is easier to explain. The file got longer. Every chat paid for the extra tokens. And the model still guessed on the procedures I had not written down, because I had been protecting the file from getting *even* longer.

That is the split.

## What codebrief actually writes

[codebrief](/work/codebrief) walks a repository and writes the always-on layer:

- `CONTEXT.md` — a short brief a human can also read
- Cursor rules
- GitHub Copilot instructions

It is Node.js only. No plugin marketplace, no GUI, no runtime npm dependencies. You run it, you get files, you commit the ones you want.

The point is not “AI setup in 30 seconds.” The point is a first draft of *what this repo is* that does not depend on me pasting three random files into a chat and hoping the model infers the rest.

I use it on my own products. If it cannot describe a repo I already understand, it is not ready for anyone else.

## What skillbrief actually writes

[skillbrief](/work/skillbrief) walks the same repository and writes Agent Skills. Those are `SKILL.md` files that load when the task matches — Next.js routing, tests, UI, a database, auth — and stay out of the way when it does not.

On this portfolio, `npx skillbrief` produced `.agents/skills/` with a working-in-portfolio-nextjs skill plus more specific ones for tests, styling, and Next.js. I keep those in git. Cursor also looks at `.cursor/skills/`; that whole `.cursor/` directory stays gitignored here, so the committed copy is the `.agents/` one.

The files are a skeleton, not a senior reading your source. v1 will omit project-specific paths. It can miss a deploy target. On this site I had to add the theme inversion by hand, and the note that `data/projects.json` is the only work catalog. Treat the output as a first draft. If you commit it unchanged, you taught the agent a generic Next.js app, not yours.

That limitation is why I shipped a second CLI instead of teaching codebrief to emit skills. Always-on context should stay short and true. Skills should stay optional and editable. Mixing them in one generator made it too easy to dump procedures back into the always-on file.

## The two jobs, side by side

| | codebrief | skillbrief |
|---|---|---|
| Question it answers | What is this repo? | How do I work in it? |
| When it loads | Every chat | When the task matches |
| Typical output | `CONTEXT.md`, Cursor rules, Copilot instructions | `SKILL.md` files |
| If you skip it | The model guesses the stack | The model guesses the procedure |
| If you overdo it | A rules file nobody reads | A skill for every folder, still unused |

You can run only codebrief. Plenty of repos only need a decent `CONTEXT.md`. skillbrief is for the moment the always-on file is doing two jobs and getting worse at both.

## What I actually did on this site

I ran both against [muratoncu.com](https://www.muratoncu.com). codebrief’s job was identity: npm, App Router, Tailwind, work in JSON, writing in markdown. skillbrief’s job was the day-to-day: `npm run test`, not a second package manager; components in `/components`; do not invent a second projects file.

The human pass was small and specific. Theme inversion. Catalog location. A line that Vercel is the host. That is the useful part of the workflow — generate, then write the three rules a scan will never see.

I did not invent download counts around either package. Both are on npm. Both are used here. That is the claim.

## When to run which

If an agent keeps suggesting the wrong stack, run codebrief and edit the brief until a stranger could read it.

If the stack is right but every new page, test, or UI change still turns into a guessing session, run skillbrief and then add the paths and commands the skeleton missed.

If you only remember one thing: always-on context is identity. Skills are procedures. One rules file can hold both for a week. After that it is just a longer way to make the model ignore you.

The case studies are [codebrief](/work/codebrief) and [skillbrief](/work/skillbrief). The packages are [`codebrief`](https://www.npmjs.com/package/codebrief) and [`skillbrief`](https://www.npmjs.com/package/skillbrief) on npm.
