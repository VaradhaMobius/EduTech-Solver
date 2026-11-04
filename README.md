# InkMark (EduTech-Solver)

CBSE Class 12 Mathematics practice with **handwriting-first** answers.

Students write on a digital canvas (or upload a photo of notebook work). The app
reads the handwriting with a vision LLM and marks it against the official
worked solution from a curated question bank.

## Quick start

```bash
cd web
cp .env.example .env.local   # optional: add OPENAI_API_KEY for live grading
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without `OPENAI_API_KEY`, the UI still works: you can practice, submit, and
reveal official solutions. Grading runs in demo mode until a key is set.

## What’s in v1

- Seed question bank across CBSE Class 12 Maths chapters (with worked solutions)
- Digital handwriting canvas (stylus / finger) with undo / clear
- Photo / camera upload of paper answers
- Vision grading API (`POST /api/grade`) using OpenAI (gpt-4o by default)
- Reveal official solution any time

## Project layout

```
web/
  src/app/           # Next.js App Router pages + API
  src/components/    # Canvas, photo upload, grading UI, math renderer
  src/data/          # Chapters + question bank
  src/lib/           # Types + grading helper
```

## Grading notes

Auto-grading uses the question prompt, official final answer, worked solution,
and the submitted image. Scores support partial credit. Treat results as a
strong practice signal — not a substitute for a human examiner on edge cases.

## Vercel + API key

1. Set **Root Directory** to `web`
2. Add `OPENAI_API_KEY` under Project → Settings → Environment Variables
   - Enable **Production** (and Preview if you want)
   - Do **not** use a `NEXT_PUBLIC_` prefix
3. **Redeploy** after saving the variable (Deployments → … → Redeploy).
   Adding a key alone does not update an already-built deployment.
4. Confirm: open `/api/health` — you want `"openaiConfigured": true`.

## Security defaults

`POST /api/grade` includes:

- Per-IP rate limits (default **8/min**, **40/hour**; override via env)
- Same-origin checks in production
- Image MIME/size validation (PNG/JPEG/WebP, ~3MB)
- Security headers + CSP via middleware
- OpenAI timeouts and sanitized production error messages

Optional durable rate limiting across serverless instances: set
`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
