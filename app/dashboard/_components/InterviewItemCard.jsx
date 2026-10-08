import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Play, RotateCcw, BarChart3 } from "lucide-react";

const InterviewItemCard = ({ interview }) => {
  const total = interview?.questionCount || 0;
  const answered = Math.min(interview?.answeredCount || 0, total || Infinity);
  const pct = total ? Math.round((answered / total) * 100) : 0;
  const state = answered === 0 ? "new" : answered >= total ? "done" : "progress";

  const base = "/dashboard/interview/" + interview?.mockId;
  const primary =
    state === "new"
      ? { href: base, label: "Start", icon: Play }
      : state === "progress"
        ? { href: base + "/start", label: "Resume", icon: RotateCcw }
        : { href: base + "/feedback", label: "View report", icon: BarChart3 };
  const PrimaryIcon = primary.icon;

  return (
    <div className="glass-card card-hover flex flex-col rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg leading-snug">{interview?.jobPosition}</h3>
        {state === "done" && interview?.avgRating !== null ? (
          <span className="shrink-0 rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
            {interview.avgRating}/10
          </span>
        ) : state === "progress" ? (
          <span className="shrink-0 rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-semibold text-warning">
            In progress
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            New
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>{interview?.jobExperience} yrs experience</span>
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {interview?.createdAt}
        </span>
        {interview?.resumeAnalysis ? (
          <span className="inline-flex items-center gap-1 text-accent">
            <FileText className="h-3 w-3" /> Resume
          </span>
        ) : null}
      </div>

      {total ? (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {answered} of {total} answered
            </span>
            <span>{pct}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className={`h-full rounded-full transition-all ${state === "done" ? "bg-success" : "bg-accent"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-5 flex gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link href={base + "/feedback"}>Feedback</Link>
        </Button>
        <Button asChild size="sm" className="flex-1">
          <Link href={primary.href}>
            <PrimaryIcon className="mr-1.5 h-3.5 w-3.5" /> {primary.label}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default InterviewItemCard;
