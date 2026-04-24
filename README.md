# arjun-gurjar.com

Personal website of Arjun Gurjar — CS + MCB student at UC Berkeley, researcher in computational biology and genomic ML.

Built to be a genuine home on the internet, not a portfolio. Has a blog, research notes, photos, and the occasional half-formed thought.

## Pages

| Route | Description |
|---|---|
| `/` | Home |
| `/about` | Background, bio, contact |
| `/research` | Research interests |
| `/experience` | Work and research experience |
| `/publications` | Papers and conference presentations |
| `/projects` | Things I've built |
| `/coursework` | UC Berkeley coursework by semester |
| `/favorites` | Books and movies |
| `/photos` | Photography |
| `/now` | What I'm currently thinking about |
| `/blog` | Writing |

## Stack

- **Framework** — [Next.js 16](https://nextjs.org) (App Router)
- **Styling** — [Tailwind CSS v4](https://tailwindcss.com)
- **Blog** — Markdown files via [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- **Deployment** — [Vercel](https://vercel.com)

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Writing a blog post

Add a `.md` file to `content/blog/` with this frontmatter:

```markdown
---
title: "Post title"
date: "2025-01-01"
excerpt: "One sentence summary."
tags: ["tag1", "tag2"]
---

Post body here.
```
