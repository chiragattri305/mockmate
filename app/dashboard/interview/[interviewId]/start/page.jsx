"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import QuestionSection from "./_components/QuestionSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Flag, Loader2 } from "lucide-react";

// Per-interview progress (current question + visited questions) kept in the browser
// so a half-finished interview resumes where the user left off.
const progressKey = (id) => `mockmate:progress:${id}`;

const readProgress = (id) => {
  try {
    return JSON.parse(localStorage.getItem(progressKey(id))) || null;
  } catch {
    return null;
  }
};

const writeProgress = (id, data) => {
  try {
    localStorage.setItem(progressKey(id), JSON.stringify(data));
  } catch {
    // storage unavailable (private mode) — resume falls back to first unanswered question
  }
};

const StartInterview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // question text -> { userAns, rating, feedback }
  const [visited, setVisited] = useState([0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [interviewRes, answersRes] = await Promise.all([
          fetch(`/api/interviews/${params.interviewId}`),
          fetch(`/api/interviews/${params.interviewId}/feedback`),
        ]);
        if (!interviewRes.ok) throw new Error("Interview not found.");
        const data = await interviewRes.json();
        const questions = JSON.parse(data.jsonMockResp);

        const saved = {};
        if (answersRes.ok) {
          const rows = await answersRes.json();
          rows.forEach((row) => {
            saved[row.question] = { userAns: row.userAns, rating: row.rating, feedback: row.feedback };
          });
        }

        // Resume: last position from this browser, otherwise the first unanswered question.
        const progress = readProgress(params.interviewId);
        const firstUnanswered = questions.findIndex((q) => !saved[q.Question]);
        let start = progress?.index ?? (firstUnanswered === -1 ? 0 : firstUnanswered);
        start = Math.min(Math.max(0, start), questions.length - 1);

        setMockInterviewQuestion(questions);
        setInterviewData(data);
        setAnswers(saved);
        setVisited(Array.from(new Set([...(progress?.visited ?? []), start])));
        setActiveQuestionIndex(start);
      } catch (err) {
        setError(err.message || "Could not load this interview.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.interviewId]);

  const goTo = useCallback(
    (index) => {
      if (!mockInterviewQuestion || index < 0 || index >= mockInterviewQuestion.length) return;
      setActiveQuestionIndex(index);
      setVisited((prev) => (prev.includes(index) ? prev : [...prev, index]));
    },
    [mockInterviewQuestion]
  );

  // Persist position whenever it changes
  useEffect(() => {
    if (!mockInterviewQuestion) return;
    writeProgress(params.interviewId, { index: activeQuestionIndex, visited });
  }, [activeQuestionIndex, visited, mockInterviewQuestion, params.interviewId]);

  // answered | skipped | pending | current
  const statuses = useMemo(() => {
    if (!mockInterviewQuestion) return [];
    const furthest = Math.max(...visited, activeQuestionIndex);
    return mockInterviewQuestion.map((q, i) => {
      if (answers[q.Question]) return "answered";
      if (i === activeQuestionIndex) return "current";
      if (visited.includes(i) || i < furthest) return "skipped";
      return "pending";
    });
  }, [mockInterviewQuestion, answers, visited, activeQuestionIndex]);

  const answeredCount = statuses.filter((s) => s === "answered").length;

  const handleAnswerSaved = useCallback(
    (question, saved, { advance }) => {
      setAnswers((prev) => ({ ...prev, [question]: saved }));
      if (advance) {
        const next = activeQuestionIndex + 1;
        if (next < mockInterviewQuestion.length) {
          setTimeout(() => goTo(next), 600);
        }
      }
    },
    [activeQuestionIndex, mockInterviewQuestion, goTo]
  );

  if (loading) {
    return (
      <div className="my-16 flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading your interview…
      </div>
    );
  }

  if (error || !mockInterviewQuestion) {
    return (
      <div className="my-16 text-center">
        <p className="mb-4 text-destructive">{error || "Could not load this interview."}</p>
        <Link href="/dashboard">
          <Button variant="outline">Back to dashboard</Button>
        </Link>
      </div>
    );
  }

  const isLast = activeQuestionIndex === mockInterviewQuestion.length - 1;
  const activeQuestion = mockInterviewQuestion[activeQuestionIndex];

  return (
    <div className="py-6 md:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Mock interview
          </p>
          <h1 className="text-xl font-semibold md:text-2xl">{interviewData?.jobPosition}</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{answeredCount}</span> of{" "}
          {mockInterviewQuestion.length} answered
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <QuestionSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          statuses={statuses}
          onSelect={goTo}
        />
        <RecordAnswerSection
          key={activeQuestionIndex}
          question={activeQuestion}
          savedAnswer={answers[activeQuestion?.Question]}
          interviewData={interviewData}
          onAnswerSaved={handleAnswerSaved}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => goTo(activeQuestionIndex - 1)}
          disabled={activeQuestionIndex === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Previous
        </Button>
        <div className="flex gap-3">
          {!isLast && (
            <Button onClick={() => goTo(activeQuestionIndex + 1)}>
              {answers[activeQuestion?.Question] ? "Next" : "Skip"}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
          <Link href={"/dashboard/interview/" + interviewData?.mockId + "/feedback"}>
            <Button variant={isLast ? "default" : "outline"}>
              <Flag className="mr-1.5 h-4 w-4" /> End Interview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StartInterview;
