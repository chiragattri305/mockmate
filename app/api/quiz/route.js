import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateText, parseAiJson } from "@/utils/GeminiAIModal";
import { rateLimit } from "@/utils/rateLimit";
import { QUIZ_TOPIC_NAMES } from "@/utils/quizTopics";

export const maxDuration = 60;

// POST /api/quiz — generate multiple-choice interview questions for a topic
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = rateLimit(`quiz:${userId}`, { limit: 12, windowMs: 60_000 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();
    const topic = String(body?.topic ?? "").trim();
    if (!topic || !QUIZ_TOPIC_NAMES.includes(topic)) {
      return NextResponse.json({ error: "Invalid topic" }, { status: 400 });
    }

    const count = 8;
    const prompt = `Generate ${count} multiple-choice interview questions on the topic "${topic}".
Mix easy, medium, and hard difficulty. Each question must have exactly 4 distinct options and exactly one correct answer.
Respond with ONLY a valid JSON array in this exact shape (no markdown):
[
  {
    "question": "A clear interview question?",
    "options": ["option A", "option B", "option C", "option D"],
    "answer": 0,
    "explanation": "One concise sentence on why the answer is correct."
  }
]
"answer" is the zero-based index (0-3) of the correct option.`;

    const aiText = await generateText(prompt, { json: true });

    let questions;
    try {
      questions = parseAiJson(aiText);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response. Try again." }, { status: 502 });
    }

    // Validate and normalize
    if (!Array.isArray(questions) && Array.isArray(questions?.questions)) questions = questions.questions;
    const valid = Array.isArray(questions)
      ? questions.filter(
          (q) =>
            q &&
            typeof q.question === "string" &&
            Array.isArray(q.options) &&
            q.options.length === 4 &&
            Number.isInteger(q.answer) &&
            q.answer >= 0 &&
            q.answer <= 3
        )
      : [];

    if (valid.length === 0) {
      return NextResponse.json({ error: "Invalid AI response format. Try again." }, { status: 502 });
    }

    return NextResponse.json({ topic, questions: valid });
  } catch (error) {
    console.error("[POST /api/quiz]", error);
    return NextResponse.json({ error: "Failed to generate quiz." }, { status: 500 });
  }
}
