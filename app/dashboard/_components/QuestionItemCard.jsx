import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Building2 } from "lucide-react";

const QuestionItemCard = ({ question }) => {
  return (
    <div className="glass-card card-hover flex flex-col rounded-2xl p-5">
      <h3 className="font-display text-lg leading-snug">{question?.jobPosition}</h3>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>{question?.jobExperience} yrs experience</span>
        {question?.company ? (
          <span className="inline-flex items-center gap-1">
            <Building2 className="h-3 w-3" /> {question.company}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1">
          <Calendar className="h-3 w-3" /> {question?.createdAt}
        </span>
      </div>
      {question?.typeQuestion ? (
        <span className="mt-3 w-fit rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
          {question.typeQuestion}
        </span>
      ) : null}
      <Button asChild size="sm" className="mt-5">
        <Link href={"/dashboard/pyq/" + question?.mockId}>Open questions</Link>
      </Button>
    </div>
  );
};

export default QuestionItemCard;
