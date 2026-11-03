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
