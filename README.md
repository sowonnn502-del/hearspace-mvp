# HearSpace

HearSpace is an MVP Alpha project for testing whether AI can turn a photo into an emotionally memorable atmosphere card.

## MVP Scope

- Upload one image.
- Generate mood title, time label, space personality, emotional writing, music keywords, and visual mood tags.
- Present the result as an Apple x Film inspired mood experience.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Qwen-VL / Qwen2.5-VL via DashScope API in a later task

## Local Development

Install Node.js first, then run:

```bash
npm install
npm run dev:clean
```

Open:

```bash
http://127.0.0.1:3000
```

## Development Workflow

Use `npm run dev:clean` for normal local development. It deletes the Next.js
cache first, then starts the dev server. This avoids stale `.next` files after
switching branches, changing dependencies, or moving the project between
machines.

Available scripts:

```bash
npm run clean      # delete .next
npm run dev        # start Next.js dev server
npm run dev:clean  # clean cache, then start dev server
npm run build      # production build
npm run rebuild    # clean cache, then production build
```

## When To Use Build

Use `npm run rebuild` before sharing, deploying, or checking whether the app
compiles for production.

Do not run `npm run build` while `npm run dev` is still running. Both commands
write to `.next`, and running them together can corrupt the dev cache. If you
need a production check, stop the dev server first with `Ctrl + C`, then run:

```bash
npm run rebuild
```

After the build check, restart local preview with:

```bash
npm run dev:clean
```

## Recovering From Page Crashes

If a page shows a 500 error, raw unstyled links, missing CSS, or an error like
`Cannot find module './331.js'`, the Next.js cache is probably out of sync.

Recovery steps:

```bash
# 1. Stop the current dev server with Ctrl + C

# 2. Clean the Next.js cache
npm run clean

# 3. Restart development
npm run dev:clean
```

Then hard-refresh the browser with `Cmd + Shift + R`.

## Vercel Deployment

Deploy from GitHub:

1. Push the project to a GitHub repository.
2. In Vercel, choose **Add New Project**.
3. Import the GitHub repository.
4. Keep the default Next.js build settings.
5. Add the required environment variables before deploying.

Required Vercel Environment Variables:

```bash
DASHSCOPE_API_KEY=your_dashscope_api_key
QWEN_VL_MODEL=qwen2.5-vl-72b-instruct
```

`DASHSCOPE_API_KEY` must be stored only in Vercel Environment Variables or in a
local `.env.local` file. Do not commit API keys to GitHub.

If you change `DASHSCOPE_API_KEY` or `QWEN_VL_MODEL` in Vercel, redeploy the
project for the new values to take effect.

Before deployment, run:

```bash
npm run rebuild
```
