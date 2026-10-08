# MockMate

**MockMate** is an AI-powered mock interview platform. Describe the role you are preparing for, optionally upload your resume, and MockMate asks you role-specific interview questions, listens to (or reads) your answers, rates each one out of 10 and tells you exactly what to improve, with a visual report at the end.

**Live:** [mockmate-ten-lac.vercel.app](https://mockmate-ten-lac.vercel.app)

Built with Next.js 14, MongoDB, Clerk and the Google Gemini API, deployed on Vercel.

## Features

### Mock interviews
- **Role-specific questions** — five interview questions with model answers, generated from the job title, tech stack and years of experience.
- **Resume-tailored interviews** — upload a resume (PDF, up to 4 MB); Gemini reads it, tailors the questions to your real background and writes a resume-vs-role fit analysis covering strengths and gaps.
- **Answer by voice or by typing** — record a spoken answer (transcribed by Gemini, works in Chrome, Firefox and Safari) or switch to the typed answer box.
- **Instant feedback** — every answer is rated out of 10 with written feedback; re-answering a question replaces the earlier attempt.
- **Progress tracking** — each question is marked as answered (✓), skipped or not answered; your saved answer is shown whenever you revisit a question, and a typed answer moves you straight to the next question.
- **Resume where you left off** — leave an interview half-way and it reopens at the same question; the dashboard shows progress for every interview with a one-click *Resume* button.
- **Visual report** — overall score gauge, per-question rating chart, summary table and detailed feedback with the ideal answer.

### Practice and motivation
- **Question bank** — generate company- and topic-specific question sets to study.
- **AI Quiz Arena** — pick a topic and answer AI-generated multiple-choice questions with hearts, points and streak bonuses.
- **Leaderboard** — quiz points are saved and ranked across all players.

### Platform
- **Authentication** with Clerk; every API route checks the signed-in user, and interviews, answers and question sets are only readable by their owner.
- **Resilient AI layer** — all Gemini calls go through one helper that falls back across models and retries when a model is overloaded, and requests JSON output for structured responses.
- **Rate limiting** on AI-heavy endpoints.
- **Responsive design** with light and dark themes: warm neutral palette, serif display type (Fraunces) and Inter for body text.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router, Route Handlers, Server Actions), React 18 |
| Styling | Tailwind CSS, shadcn/ui (Radix UI), lucide-react, Framer Motion |
| Database | MongoDB Atlas with Mongoose |
| Authentication | Clerk |
| AI | Google Gemini API (`@google/generative-ai`) — question generation, resume analysis, answer evaluation, audio transcription, quiz generation |
| Charts | Recharts |
| Hosting | Vercel (continuous deployment from `main`) |

## Project Structure

```
app/
  page.js                      Landing page
  (auth)/sign-in, sign-up      Clerk authentication pages
  dashboard/
    page.jsx                   Dashboard: stats + interview list
    interview/[interviewId]/   Interview intro, /start (question + answer), /feedback (report)
    question/, pyq/[pyqId]/    Question bank
    game/                      AI Quiz Arena
    leaderboard/               Leaderboard
  api/
    interviews/                Create + list interviews, answers, feedback
    questions/                 Question bank generation and lookup
    quiz/                      Quiz question generation
    transcribe/                Audio transcription
    newsletter/                Contact form
actions/quiz.ts                Server action that saves quiz results
components/                    Shared UI (Logo, AuthShell, theme, shadcn/ui)
utils/
  GeminiAIModal.js             Gemini helper (model fallback, retries, JSON parsing)
  db.js, schema.js             MongoDB connection and Mongoose models
  queries.ts                   Leaderboard / progress queries
  rateLimit.js                 In-memory rate limiter
middleware.js                  Clerk route protection for /dashboard
```

## API Routes

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/interviews` | Generate questions (optionally from a resume PDF) and create an interview |
| `GET` | `/api/interviews/list` | The user's interviews with progress (answered count, average rating) |
| `GET` | `/api/interviews/[id]` | One interview (owner only) |
| `POST` | `/api/interviews/[id]/answer` | Evaluate an answer with Gemini and save it (upsert per question) |
| `GET` | `/api/interviews/[id]/feedback` | All saved answers and feedback for an interview |
| `POST` | `/api/transcribe` | Transcribe a recorded answer |
| `POST` | `/api/questions` | Generate a question-bank set |
| `GET` | `/api/questions/list`, `/api/questions/[id]` | List / read question-bank sets |
| `POST` | `/api/quiz` | Generate multiple-choice quiz questions for a topic |
| `POST` | `/api/newsletter` | Save a contact-form message |

## Getting Started

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/chiragattri305/mockmate.git
   cd mockmate
   npm install
   ```

2. Create a `.env` file in the project root (see `.env.example`):
   ```env
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

3. Start the development server and open [http://localhost:3000](http://localhost:3000):
   ```bash
   npm run dev
   ```

4. Production build:
   ```bash
   npm run build && npm start
   ```

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string (Atlas network access must allow the host, e.g. `0.0.0.0/0` for Vercel) |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `_SIGN_UP_URL` | No | Auth page paths (default `/sign-in`, `/sign-up`) |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` / `_AFTER_SIGN_UP_URL` | No | Redirect after auth (default `/dashboard`) |
| `GEMINI_MODEL` | No | Comma-separated model fallback list; defaults to `gemini-3.5-flash,gemini-2.5-flash,gemini-3.5-flash-lite` |
| `NEXT_PUBLIC_INFORMATION` | No | Note shown on the interview intro page |
| `NEXT_PUBLIC_QUESTION_NOTE` | No | Tip shown beside each question |

## Deployment

The app is deployed on Vercel. Every push to `main` triggers a production deployment. Set the environment variables above in the Vercel project settings; AI routes declare `maxDuration = 60` so longer Gemini calls (for example resume analysis) are not cut off. A Docker setup is also available — see [README.Docker.md](./README.Docker.md).

## Contact

For feedback or questions, reach out to **Chirag Attri** at [chiragattri305@gmail.com](mailto:chiragattri305@gmail.com).

## License

Copyright © 2026 Chirag Attri. All rights reserved. See [LICENSE](./LICENSE).
