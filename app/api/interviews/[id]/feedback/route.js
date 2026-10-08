import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";

// GET /api/interviews/[id]/feedback — fetch all answers+feedback for an interview
export async function GET(request, { params }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Interview ID is required" }, { status: 400 });
    }

    await connectDB();
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress ?? "";
    const result = await UserAnswer.find({ mockIdRef: id, userEmail })
      .sort({ _id: 1 })
      .lean();

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/interviews/[id]/feedback]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
