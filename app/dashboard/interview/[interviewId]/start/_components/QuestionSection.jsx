import { Check, Lightbulb, SkipForward, Volume2, Circle } from "lucide-react";
import React from "react";

const STATUS_STYLES = {
  answered: {
    pill: "border-success/40 bg-success/10 text-success",
    icon: Check,
    label: "Answered",
  },
  skipped: {
    pill: "border-warning/50 bg-warning/10 text-warning",
    icon: SkipForward,
    label: "Skipped",
  },
  pending: {
    pill: "border-danger/40 bg-danger/5 text-danger",
    icon: Circle,
    label: "Not answered",
  },
  current: {
    pill: "border-foreground bg-foreground text-background",
    icon: null,
    label: "Current",
  },
};

const QuestionSection = ({ mockInterviewQuestion, activeQuestionIndex, statuses = [], onSelect }) => {
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };

  if (!mockInterviewQuestion) return null;

  return (
    <div className="glass-card flex flex-col rounded-2xl p-5 md:p-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Questions">
        {mockInterviewQuestion.map((_, index) => {
          const isActive = index === activeQuestionIndex;
          const status = statuses[index] ?? "pending";
          const style = STATUS_STYLES[status];
          const Icon = style.icon;
          return (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Question ${index + 1}: ${style.label}`}
              onClick={() => onSelect?.(index)}
              className={`inline-flex h-9 min-w-[2.75rem] cursor-pointer items-center justify-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                style.pill
              } ${isActive && status !== "current" ? "ring-2 ring-foreground ring-offset-2 ring-offset-card" : ""}`}
            >
              {Icon ? <Icon className="h-3.5 w-3.5" strokeWidth={2.5} /> : null}
              Q{index + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-success" /> Answered
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-warning" /> Skipped
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-danger" /> Not answered
        </span>
      </div>

      <div className="mt-6 border-t pt-6">
        <p className="eyebrow">Question {activeQuestionIndex + 1} of {mockInterviewQuestion.length}</p>
        <h2 className="mt-2 font-display text-xl leading-snug md:text-2xl">
          {mockInterviewQuestion[activeQuestionIndex]?.Question}
        </h2>
        <button
          type="button"
          onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.Question)}
          className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Volume2 className="h-4 w-4" /> Read aloud
        </button>
      </div>

      {process.env.NEXT_PUBLIC_QUESTION_NOTE ? (
        <div className="mt-auto hidden rounded-xl bg-secondary p-4 pt-4 md:mt-8 md:block">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Lightbulb className="h-4 w-4 text-accent" /> Tip
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{process.env.NEXT_PUBLIC_QUESTION_NOTE}</p>
        </div>
      ) : null}
    </div>
  );
};

export default QuestionSection;
