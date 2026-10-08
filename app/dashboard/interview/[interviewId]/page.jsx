"use client";
import { Lightbulb, WebcamIcon, FileText, Loader2, ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";
import Link from "next/link";
import { useContext } from "react";
import { WebCamContext } from "../../layout";

const Interview = ({ params }) => {
  const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviewDetails();
  }, []);

  const fetchInterviewDetails = async () => {
    try {
      const res = await fetch(`/api/interviews/${params.interviewId}`);
      if (!res.ok) throw new Error("Failed to fetch interview");
      const data = await res.json();
      setInterviewData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="my-16 flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading interview details…
      </div>
    );
  }

  if (!interviewData) {
    return <div className="my-16 text-center text-destructive">Interview not found.</div>;
  }

  return (
    <div className="py-8 md:py-12">
      <p className="eyebrow">Get ready</p>
      <h1 className="mt-2 font-display text-3xl md:text-4xl">{interviewData.jobPosition}</h1>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="glass-card rounded-2xl p-5">
            <dl className="grid gap-4 text-sm">
              <div>
                <dt className="eyebrow">Role</dt>
                <dd className="mt-1 text-base">{interviewData.jobPosition}</dd>
              </div>
              <div>
                <dt className="eyebrow">Tech stack / description</dt>
                <dd className="mt-1 text-base">{interviewData.jobDesc}</dd>
              </div>
              <div>
                <dt className="eyebrow">Experience</dt>
                <dd className="mt-1 text-base">{interviewData.jobExperience} years</dd>
              </div>
            </dl>
          </div>

          {process.env.NEXT_PUBLIC_INFORMATION ? (
            <div className="rounded-2xl border-l-4 border-l-warning bg-warning/10 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Lightbulb className="h-4 w-4 text-warning" /> Before you start
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{process.env.NEXT_PUBLIC_INFORMATION}</p>
            </div>
          ) : null}

          {interviewData.resumeAnalysis ? (
            <div className="glass-card rounded-2xl p-5">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4 text-accent" /> Resume analysis
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {interviewData.resumeAnalysis}
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-2xl border bg-neutral-950">
            {webCamEnabled ? (
              <Webcam
                audio={false}
                mirrored
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                className="aspect-video w-full object-cover"
              />
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 text-neutral-400">
                <WebcamIcon className="h-10 w-10" />
                <p className="text-sm">Camera is off — optional, it is never recorded</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" className="flex-1" onClick={() => setWebCamEnabled((prev) => !prev)}>
              {webCamEnabled ? "Turn off camera" : "Test camera"}
            </Button>
            <Button asChild className="flex-1">
              <Link href={"/dashboard/interview/" + params.interviewId + "/start"}>
                Start interview <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
