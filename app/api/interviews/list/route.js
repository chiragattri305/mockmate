export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/utils/db";
import { MockInterview } from "@/utils/schema";

// GET /api/interviews/list — fetch all interviews for the currently logged-in user
export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = user.primaryEmailAddress?.emailAddress ?? "";
    if (!userEmail) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    await connectDB();
    const result = await MockInterview.find({ createdBy: userEmail })
      .sort({ _id: -1 })
      .lean();

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/interviews/list]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
