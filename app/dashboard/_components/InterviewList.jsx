"use client";
import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";
import AddNewInterview from "./AddNewInterview";
import { Skeleton } from "@/components/ui/skeleton";

const Stat = ({ label, value, hint }) => (
  <div className="glass-card rounded-2xl p-5">
    <p className="eyebrow">{label}</p>
    <p className="mt-2 font-display text-3xl">{value}</p>
    {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
  </div>
);

const InterviewList = () => {
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await fetch("/api/interviews/list");
        if (!res.ok) throw new Error();
        setInterviewList(await res.json());
      } catch {
        setFailed(true);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const completed = interviewList.filter((i) => i.questionCount && i.answeredCount >= i.questionCount);
  const inProgress = interviewList.filter((i) => i.answeredCount > 0 && i.answeredCount < i.questionCount);
  const rated = completed.filter((i) => i.avgRating !== null);
  const avg = rated.length
    ? (rated.reduce((sum, i) => sum + i.avgRating, 0) / rated.length).toFixed(1)
    : "—";

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AddNewInterview />
        {loading ? (
          [...Array(3)].map((_, i) => <Skeleton key={i} className="h-[150px] rounded-2xl" />)
        ) : (
          <>
            <Stat label="Interviews" value={interviewList.length} hint="created so far" />
            <Stat label="Completed" value={completed.length} hint={`${inProgress.length} in progress`} />
            <Stat label="Average score" value={avg} hint="across completed interviews" />
          </>
        )}
      </div>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl">Your interviews</h2>
          {!loading && interviewList.length > 0 ? (
            <span className="text-sm text-muted-foreground">{interviewList.length} total</span>
          ) : null}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : failed ? (
          <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            Could not load your interviews. Please refresh the page.
          </p>
        ) : interviewList.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <p className="font-display text-lg">No interviews yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first mock interview — add a resume for questions tailored to you.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {interviewList.map((interview) => (
              <InterviewItemCard key={interview.mockId} interview={interview} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default InterviewList;
