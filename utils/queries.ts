import { cache } from "react";
import { connectDB } from "./db";
import { auth } from "@clerk/nextjs/server";
import { UserProgress } from "./schema";

export type PlayerProgress = {
  userId: string;
  userName: string;
  userImageSrc: string;
  points: number;
  gamesPlayed: number;
  bestScore: number;
};

const toPlayer = (p: any): PlayerProgress => ({
  userId: p.userId,
  userName: p.userName,
  userImageSrc: p.userImageSrc,
  points: p.points ?? 0,
  gamesPlayed: p.gamesPlayed ?? 0,
  bestScore: p.bestScore ?? 0,
});

// Progress for the currently authenticated player (null if none yet)
export const getUserProgress = cache(async (): Promise<PlayerProgress | null> => {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    await connectDB();
    const data: any = await UserProgress.findOne({ userId }).lean();
    return data ? toPlayer(data) : null;
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return null;
  }
});

// Top players by total points for the leaderboard
export const getLeaderboard = cache(async (limit = 20): Promise<PlayerProgress[]> => {
  try {
    await connectDB();
    const data: any[] = await UserProgress.find().sort({ points: -1 }).limit(limit).lean();
    return data.map(toPlayer);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
});
