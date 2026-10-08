"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useContext, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { CheckCircle2, Keyboard, Loader2, Mic, Square, Video, VideoOff } from "lucide-react";
import { toast } from "sonner";
import { WebCamContext } from "@/app/dashboard/layout";

const MIN_ANSWER_LENGTH = 10;

const RecordAnswerSection = ({ question, savedAnswer, interviewData, onAnswerSaved }) => {
  const [mode, setMode] = useState("speak"); // speak | type
  const [typedAnswer, setTypedAnswer] = useState("");
  const [status, setStatus] = useState("idle"); // idle | recording | transcribing | saving
  const [editing, setEditing] = useState(!savedAnswer);
  const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const busy = status === "transcribing" || status === "saving";

  // Release the mic if the user switches question mid-recording
  useEffect(() => {
    return () => {
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state === "recording") {
        recorder.onstop = null;
        recorder.stop();
        recorder.stream?.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const saveAnswer = async (answer, { advance }) => {
    const text = answer?.trim() ?? "";
    if (text.length <= MIN_ANSWER_LENGTH) {
      toast.error("Answer too short. Please give a more detailed answer and try again.");
      return false;
    }
    if (!interviewData?.mockId || !question) return false;

    try {
      setStatus("saving");
      const res = await fetch(`/api/interviews/${interviewData.mockId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.Question,
          correctAns: question.Answer,
          userAns: text,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to save answer. Please try again.");

      toast.success(advance ? "Answer saved. Moving to the next question." : "Answer saved.");
      setEditing(false);
      onAnswerSaved?.(question.Question, { userAns: text, rating: data.rating, feedback: data.feedback }, { advance });
      return true;
    } catch (err) {
      toast.error(err.message || "An error occurred while saving your answer.");
      return false;
    } finally {
      setStatus("idle");
    }
  };

  const transcribeAndSave = async (audioBlob) => {
    try {
      setStatus("transcribing");
      const formData = new FormData();
      const ext = audioBlob.type.includes("mp4") ? "mp4" : "webm";
      formData.append("audio", audioBlob, `recording.${ext}`);

      const res = await fetch("/api/transcribe", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const { transcription } = await res.json();
      await saveAnswer(transcription, { advance: false });
    } catch {
      toast.error("Error transcribing audio. Please try again.");
      setStatus("idle");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const mimeType = mediaRecorderRef.current?.mimeType || "audio/webm";
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        stream.getTracks().forEach((t) => t.stop());
        await transcribeAndSave(audioBlob);
      };

      mediaRecorderRef.current.start();
      setStatus("recording");
    } catch {
      toast.error("Could not access the microphone. You can type your answer instead.");
      setMode("type");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && status === "recording") {
      mediaRecorderRef.current.stop();
      setStatus("transcribing");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Camera */}
      <div className="relative overflow-hidden rounded-2xl border bg-neutral-950">
        {webCamEnabled ? (
          <Webcam
            mirrored
            audio={false}
            onUserMediaError={() => setWebCamEnabled(false)}
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 text-neutral-400">
            <VideoOff className="h-8 w-8" />
            <p className="text-sm">Camera is off</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setWebCamEnabled((prev) => !prev)}
          className="absolute bottom-3 right-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition-colors hover:bg-black/80"
        >
          {webCamEnabled ? <VideoOff className="h-3.5 w-3.5" /> : <Video className="h-3.5 w-3.5" />}
          {webCamEnabled ? "Turn off camera" : "Turn on camera"}
        </button>
        {status === "recording" && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> Recording
          </span>
        )}
      </div>

      {/* Saved answer — stays visible whenever the user comes back to this question */}
      {savedAnswer && !editing ? (
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-success">
              <CheckCircle2 className="h-4 w-4" /> Your answer
            </p>
            {savedAnswer.rating !== undefined && savedAnswer.rating !== "" ? (
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                Rated {savedAnswer.rating}/10
              </span>
            ) : null}
          </div>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{savedAnswer.userAns}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setEditing(true)}>
            Answer again
          </Button>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-5">
          <div className="mb-4 inline-flex rounded-full border bg-secondary p-1" role="tablist">
            {[
              { key: "speak", label: "Speak", icon: Mic },
              { key: "type", label: "Type", icon: Keyboard },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={mode === key}
                disabled={busy || status === "recording"}
                onClick={() => setMode(key)}
                className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  mode === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
          </div>

          {mode === "speak" ? (
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <button
                type="button"
                onClick={status === "recording" ? stopRecording : startRecording}
                disabled={busy}
                aria-label={status === "recording" ? "Stop recording" : "Start recording"}
                className={`flex h-16 w-16 cursor-pointer items-center justify-center rounded-full transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                  status === "recording"
                    ? "bg-red-500 text-white ring-4 ring-red-500/25"
                    : "bg-accent text-accent-foreground hover:scale-105"
                }`}
              >
                {busy ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : status === "recording" ? (
                  <Square className="h-5 w-5 fill-current" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </button>
              <p className="text-sm text-muted-foreground">
                {status === "recording"
                  ? "Listening… tap to stop and submit"
                  : status === "transcribing"
                    ? "Transcribing your answer…"
                    : status === "saving"
                      ? "Evaluating your answer…"
                      : "Tap the mic and answer out loud"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Textarea
                rows={5}
                placeholder="Type your answer here…"
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                disabled={busy}
                aria-label="Your answer"
              />
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">{typedAnswer.trim().length} characters</span>
                <Button onClick={() => saveAnswer(typedAnswer, { advance: true })} disabled={busy}>
                  {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {busy ? "Evaluating…" : "Submit answer"}
                </Button>
              </div>
            </div>
          )}

          {savedAnswer ? (
            <button
              type="button"
              onClick={() => setEditing(false)}
              disabled={busy || status === "recording"}
              className="mt-4 cursor-pointer text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Keep my previous answer
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default RecordAnswerSection;
