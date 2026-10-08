import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/utils/db";
import { MockInterview } from "@/utils/schema";

// GET /api/interviews/[id] — fetch a single interview by mockId (auth-gated)
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
    const result = await MockInterview.findOne({ mockId: id, createdBy: userEmail }).lean();

    if (!result) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/interviews/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
