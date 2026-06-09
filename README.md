# Luffy's Hub

A terminal-style, read-only C programming documentation viewer built with Next.js.

## Features

- Semester and subject navigation (1st & 2nd Sem)
- Lab programs for Data Structures (20 programs)
- Notes / Lab Programs / Important section tabs
- Search, copy, and download program code
- Admin panel for in-memory CRUD (login: `luffy` / `luffy`)
- Mobile-responsive terminal UI

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- JetBrains Mono

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production Build

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel auto-detects Next.js — no extra config needed
4. Click **Deploy**

Or use the CLI:

```bash
npm i -g vercel
vercel
```

## Project Structure

```
src/app/
├── components/     # UI components
├── utils/          # Programs data, semester config, export helpers
├── layout.tsx      # Root layout
├── page.tsx        # Entry point
└── globals.css     # Global styles
```

## License

Private project.
