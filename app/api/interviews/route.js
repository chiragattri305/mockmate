import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { generateText, parseAiJson } from "@/utils/GeminiAIModal";
import { rateLimit } from "@/utils/rateLimit";
import { v4 as uuidv4 } from "uuid";

export const maxDuration = 60;

const sanitize = (str) => String(str ?? "").replace(/[<>{}]/g, "").trim().substring(0, 500);

function validateQuestions(questions) {
  if (!Array.isArray(questions) || questions.length === 0) return false;
  return questions.every((q) => q.Question && q.Answer);
}

// POST /api/interviews — generate questions via Gemini and save the interview.
// Accepts either JSON (job details only) or multipart/form-data (job details + optional resume PDF).
export async function POST(request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 5 new interviews per minute per user
    const rl = rateLimit(`create-interview:${userId}`, { limit: 5, windowMs: 60_000 });
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before creating another interview." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    // Parse body — multipart (with resume) or JSON
    const contentType = request.headers.get("content-type") || "";
    let jobPosition, jobDesc, jobExperience, resumeBase64 = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      jobPosition = form.get("jobPosition");
      jobDesc = form.get("jobDesc");
      jobExperience = form.get("jobExperience");
      const resume = form.get("resume");
      if (resume && typeof resume === "object" && resume.size > 0) {
        if (resume.type !== "application/pdf") {
          return NextResponse.json({ error: "Resume must be a PDF file." }, { status: 400 });
        }
        if (resume.size > 4 * 1024 * 1024) {
          return NextResponse.json({ error: "Resume must be under 4MB." }, { status: 400 });
        }
        const bytes = Buffer.from(await resume.arrayBuffer());
        resumeBase64 = bytes.toString("base64");
      }
    } else {
      const body = await request.json();
      ({ jobPosition, jobDesc, jobExperience } = body);
    }

    // Validate
    if (!jobPosition?.trim() || !jobDesc?.trim() || !String(jobExperience).trim()) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    const expNum = parseInt(jobExperience);
    if (isNaN(expNum) || expNum < 0 || expNum > 50) {
      return NextResponse.json(
        { error: "Years of experience must be between 0 and 50" },
        { status: 400 }
      );
    }

    const position = sanitize(jobPosition);
    const description = sanitize(jobDesc);
    const experience = sanitize(jobExperience);

    let questions;
    let resumeAnalysis = "";

    if (resumeBase64) {
      // Multimodal: send the resume PDF alongside the job details so Gemini can
      // tailor questions and analyse how the candidate's resume fits the role.
      const prompt = `You are an expert technical interviewer. A candidate is preparing for an interview.

Job Position: ${position}
Job Description / Tech Stack: ${description}
Years of Experience: ${experience}

The attached PDF is the candidate's resume. Carefully read it, then:
1. Generate 5 interview questions (with strong model answers) tailored to BOTH the target role and the candidate's actual background from the resume.
2. Write a concise "resumeAnalysis" (4-7 sentences) covering how well the resume aligns with the target role, notable strengths, and gaps or mismatches the candidate should prepare for (for example, if the resume emphasises a different stack than the role requires).

Respond with ONLY valid JSON in this exact shape:
{
  "questions": [ { "Question": "...", "Answer": "..." } ],
  "resumeAnalysis": "..."
}`;

      const aiText = await generateText(
        [{ text: prompt }, { inlineData: { mimeType: "application/pdf", data: resumeBase64 } }],
        { json: true }
      );

      let parsed;
      try {
        parsed = parseAiJson(aiText);
      } catch {
        return NextResponse.json(
          { error: "Failed to parse AI response. Please try again." },
          { status: 502 }
        );
      }
      questions = parsed?.questions;
      resumeAnalysis = typeof parsed?.resumeAnalysis === "string" ? parsed.resumeAnalysis : "";
    } else {
      const prompt = `Generate 5 interview questions and answers for:
Job Position: ${position}
Job Description: ${description}
Years of Experience: ${experience}

Please provide a valid JSON array with this exact format:
[
  {
    "Question": "Your interview question here?",
    "Answer": "Your detailed answer here."
  }
]

Keep questions professional and relevant to the job requirements.`;

      const aiText = await generateText(prompt, { json: true });
      try {
        questions = parseAiJson(aiText);
      } catch {
        return NextResponse.json(
          { error: "Failed to parse AI response. Please try again." },
          { status: 502 }
        );
      }
    }

    if (!Array.isArray(questions) && Array.isArray(questions?.questions)) questions = questions.questions;
    if (!validateQuestions(questions)) {
      return NextResponse.json(
        { error: "Invalid AI response format. Please try again." },
        { status: 502 }
      );
    }

    // Save to DB
    await connectDB();
    const userEmail = user.primaryEmailAddress?.emailAddress ?? "";
    const mockId = uuidv4();
    const createdAt = new Date().toISOString().split("T")[0];

    await MockInterview.create({
      mockId,
      jsonMockResp: JSON.stringify(questions),
      jobPosition: position,
      jobDesc: description,
      jobExperience: experience,
      createdBy: userEmail,
      createdAt,
      resumeAnalysis,
    });

    return NextResponse.json({ mockId }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/interviews]", error);
    return NextResponse.json(
      { error: "Failed to create interview. Please try again." },
      { status: 500 }
    );
  }
}
