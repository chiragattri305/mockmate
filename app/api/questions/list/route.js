export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/utils/db";
import { Question } from "@/utils/schema";

export async function GET(request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json([]);
    }

    await connectDB();
    const result = await Question.find({ createdBy: email })
      .sort({ _id: -1 })
      .lean();

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/questions/list]", error);
    return NextResponse.json({ error: "Failed to fetch question list" }, { status: 500 });
  }
}
