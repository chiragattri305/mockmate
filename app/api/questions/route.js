import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/utils/db";
import { Question } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { generateText, parseAiJson } from "@/utils/GeminiAIModal";

export const maxDuration = 60;

export async function POST(request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { jobPosition, jobDesc, jobExperience, typeQuestion, company } = body;

    if (!jobPosition || !jobDesc || !typeQuestion || !company) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const email = user.primaryEmailAddress?.emailAddress;

    const prompt = `
    Given the following details:
    - Job Position: ${jobPosition}
    - Job Description: ${jobDesc}
    - Years of Experience: ${jobExperience}
    - Type of Question: ${typeQuestion}
    - Previous Questions from this Company: ${company}

    Please generate 5 interview questions relevant to the job position, experience level, and question type provided. Each question should be accompanied by a comprehensive answer. The output should be in JSON format with "Question" and "Answer" as fields.

    Example format:
    [
      {
        "Question": "Your question here",
        "Answer": "The corresponding answer here"
      }
    ]
    `;

    let parsed;
    try {
      parsed = parseAiJson(await generateText(prompt, { json: true }));
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response. Please try again." }, { status: 502 });
    }
    if (!Array.isArray(parsed) && Array.isArray(parsed?.questions)) parsed = parsed.questions;
    if (!Array.isArray(parsed) || !parsed.every((q) => q?.Question && q?.Answer)) {
      return NextResponse.json({ error: "Invalid AI response format. Please try again." }, { status: 502 });
    }
    const MockQuestionJsonResp = JSON.stringify(parsed);

    const mockId = uuidv4();

    await connectDB();
    await Question.create({
      mockId,
      MockQuestionJsonResp,
      jobPosition,
      jobDesc,
      jobExperience: jobExperience?.toString() || "0",
      typeQuestion,
      company,
      createdBy: email ?? "",
      createdAt: new Date().toISOString().split("T")[0],
    });

    return NextResponse.json({ mockId });
  } catch (error) {
    console.error("[POST /api/questions]", error);
    return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
  }
}
