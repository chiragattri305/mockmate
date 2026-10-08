import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { generateText, parseAiJson } from "@/utils/GeminiAIModal";
import { rateLimit } from "@/utils/rateLimit";

export const maxDuration = 60;

// POST /api/interviews/[id]/answer — evaluate answer with Gemini and save to DB
export async function POST(request, { params }) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 30 answers per 5 minutes per user
    const rl = rateLimit(`record-answer:${userId}`, { limit: 30, windowMs: 5 * 60_000 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { question, correctAns, userAns } = body;

    if (!question || !userAns) {
      return NextResponse.json({ error: "question and userAns are required" }, { status: 400 });
    }

    await connectDB();
    const userEmail = user.primaryEmailAddress?.emailAddress ?? "";
    const interview = await MockInterview.findOne({ mockId: id, createdBy: userEmail }).lean();
    if (!interview) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    // Build Gemini feedback prompt
    const feedbackPrompt = `Question: ${question}
User Answer: ${userAns}

Evaluate the user's answer for the given interview question.
Provide a rating out of 10 and feedback (3-5 lines) for improvement.
Respond in this exact JSON format:
{
  "rating": 7,
  "feedback": "Your feedback here."
}`;

    const responseText = await generateText(feedbackPrompt, { json: true });

    let feedbackJson;
    try {
      feedbackJson = parseAiJson(responseText);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI feedback. Please try again." },
        { status: 502 }
      );
    }

    const createdAt = new Date().toISOString().split("T")[0];
    const rating = parseFloat(feedbackJson?.rating);

    // Upsert so re-recording a question replaces the earlier answer instead of duplicating it.
    await UserAnswer.findOneAndUpdate(
      { mockIdRef: id, question, userEmail },
      {
        correctAns: correctAns ?? "",
        userAns,
        feedback: feedbackJson?.feedback ?? "",
        rating: String(Number.isFinite(rating) ? rating : 0),
        createdAt,
      },
      { upsert: true }
    );

    return NextResponse.json({
      feedback: feedbackJson.feedback,
      rating: feedbackJson.rating,
    });
  } catch (error) {
    console.error("[POST /api/interviews/[id]/answer]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
