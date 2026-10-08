export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";
import { Trophy, Crown, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLeaderboard, getUserProgress } from "@/utils/queries";

const rankAccent = (i: number) => {
  if (i === 0) return "text-amber-500";
  if (i === 1) return "text-slate-400";
  if (i === 2) return "text-amber-700";
  return "text-muted-foreground";
};

const Leaderboard = async () => {
  const [players, me] = await Promise.all([getLeaderboard(20), getUserProgress()]);

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="mb-6 text-center">
        <h1 className="flex items-center justify-center gap-2 font-display text-3xl md:text-4xl">
          <Trophy className="h-7 w-7 text-accent" /> Leaderboard
        </h1>
        <p className="mt-1 text-muted-foreground">Top players in the AI Quiz Arena</p>
        <div className="mt-4">
          <Link href="/dashboard/game">
            <Button size="sm">Play a quiz</Button>
          </Link>
        </div>
      </div>

      {players.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center text-muted-foreground">
          No scores yet — be the first to play!
        </div>
      ) : (
        <div className="glass-card overflow-hidden rounded-2xl">
          <ul>
            {players.map((p, i) => {
              const isMe = me && p.userId === me.userId;
              return (
                <li
                  key={p.userId}
                  className={`flex items-center gap-4 border-b border-border/60 px-5 py-3 last:border-0 ${
                    isMe ? "bg-accent/10" : ""
                  }`}
                >
                  <span className={`w-6 text-center font-bold ${rankAccent(i)}`}>
                    {i === 0 ? <Crown className="mx-auto h-5 w-5" /> : i < 3 ? (
                      <Medal className="mx-auto h-5 w-5" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.userImageSrc || "/logo.svg"}
                    alt={p.userName}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full border border-border object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">
                      {p.userName} {isMe && <span className="text-xs text-accent">(you)</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.gamesPlayed} games · best {p.bestScore}
                    </p>
                  </div>
                  <span className="font-bold text-accent">{p.points}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
