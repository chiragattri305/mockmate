import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateText } from "@/utils/GeminiAIModal";

export const maxDuration = 60;

// POST /api/transcribe — transcribe audio blob via Gemini multimodal
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const audioFile = formData.get("audio");

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Convert to base64
    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    // Safari records audio/mp4, Chrome/Firefox audio/webm — pass through what the browser sent.
    const mimeType = (audioFile.type || "audio/webm").split(";")[0];

    const text = await generateText([
      { text: "Transcribe the following audio accurately. Return only the transcribed text with no additional commentary." },
      { inlineData: { data: base64Audio, mimeType } },
    ]);

    const transcription = text.trim();
    return NextResponse.json({ transcription });
  } catch (error) {
    console.error("[POST /api/transcribe]", error);
    return NextResponse.json(
      { error: "Transcription failed. Please try again." },
      { status: 500 }
    );
  }
}
