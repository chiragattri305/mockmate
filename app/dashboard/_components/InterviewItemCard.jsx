import React from 'react'
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { Briefcase, Calendar, FileText } from 'lucide-react';

const InterviewItemCard = ({ interview }) => {
  const router = useRouter()
  const onStart = () => {
    router.push("/dashboard/interview/" + interview?.mockId)
  }
  const onFeedback = () => {
    router.push("/dashboard/interview/" + interview?.mockId + "/feedback")
  }
  return (
    <div className="glass-card rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <h2 className="flex items-center gap-2 font-semibold">
          <Briefcase className="h-4 w-4 text-accent" />
          {interview?.jobPosition}
        </h2>
        {interview?.resumeAnalysis ? (
          <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
            <FileText className="h-3 w-3" /> Resume
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {interview?.jobExperience} Years of experience
      </p>
      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        <Calendar className="h-3 w-3" /> Created at: {interview.createdAt}
      </p>

      <div className="mt-4 flex justify-between gap-3">
        <Button variant="superOutline" onClick={onFeedback} size="sm" className="w-full">
          Feedback
        </Button>
        <Button onClick={onStart} size="sm" className="w-full">
          Start
        </Button>
      </div>
    </div>
  )
}

export default InterviewItemCard
