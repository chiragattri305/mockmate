export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { connectDB } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";

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
    const interviews = await MockInterview.find({ createdBy: userEmail })
      .sort({ _id: -1 })
      .lean();

    // Attach progress (answered count + average rating) so the dashboard can offer "Resume"
    const stats = await UserAnswer.aggregate([
      { $match: { userEmail, mockIdRef: { $in: interviews.map((i) => i.mockId) } } },
      {
        $group: {
          _id: "$mockIdRef",
          answered: { $sum: 1 },
          avgRating: { $avg: { $convert: { input: "$rating", to: "double", onError: 0, onNull: 0 } } },
        },
      },
    ]);
    const byId = Object.fromEntries(stats.map((s) => [s._id, s]));

    const result = interviews.map(({ jsonMockResp, ...interview }) => {
      let questionCount = 0;
      try {
        questionCount = JSON.parse(jsonMockResp).length || 0;
      } catch {
        // malformed question data — leave count at 0
      }
      const s = byId[interview.mockId];
      return {
        ...interview,
        questionCount,
        answeredCount: s?.answered ?? 0,
        avgRating: s ? Math.round(s.avgRating * 10) / 10 : null,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET /api/interviews/list]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
