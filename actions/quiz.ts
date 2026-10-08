"use server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/utils/db";
import { UserProgress } from "@/utils/schema";
import { auth, currentUser } from "@clerk/nextjs/server";

// Persist the result of a finished quiz game and return the player's updated totals.
export const saveQuizResult = async (pointsEarned: number) => {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId || !user) {
    throw new Error("Unauthorized");
  }

  // Clamp to the maximum a single game can award so the leaderboard can't be inflated.
  const points = Math.min(200, Math.max(0, Math.floor(Number(pointsEarned) || 0)));
  const userName = user.firstName || user.username || "Player";
  const userImageSrc = user.imageUrl || "/logo.svg";

  await connectDB();
  const existing: any = await UserProgress.findOne({ userId }).lean();

  if (existing) {
    const bestScore = Math.max(existing.bestScore ?? 0, points);
    await UserProgress.updateOne(
      { userId },
      {
        $inc: { points, gamesPlayed: 1 },
        $set: { bestScore, userName, userImageSrc },
      }
    );
  } else {
    await UserProgress.create({
      userId,
      userName,
      userImageSrc,
      points,
      gamesPlayed: 1,
      bestScore: points,
    });
  }

  revalidatePath("/dashboard/leaderboard");

  const updated: any = await UserProgress.findOne({ userId }).lean();
  return {
    points: updated?.points ?? points,
    bestScore: updated?.bestScore ?? points,
    gamesPlayed: updated?.gamesPlayed ?? 1,
  };
};
