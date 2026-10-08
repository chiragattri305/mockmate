"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { WebCamContext } from "@/app/dashboard/layout";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState("");
  const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Reset answer when question changes
  useEffect(() => {
    setUserAnswer("");
    setTypedAnswer("");
  }, [activeQuestionIndex]);

  const saveAnswer = useCallback(async (answer) => {
    if (!answer || answer.trim().length <= 10) {
      toast.error("Answer too short. Please give a more detailed answer and try again.");
      return false;
    }
    if (!interviewData?.mockId || !mockInterviewQuestion?.[activeQuestionIndex]) return false;

    try {
      setLoading(true);
      const res = await fetch(`/api/interviews/${interviewData.mockId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: mockInterviewQuestion[activeQuestionIndex].Question,
          correctAns: mockInterviewQuestion[activeQuestionIndex].Answer,
          userAns: answer,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save answer. Please try again.");
      }

      toast.success("Answer recorded successfully!");
      setUserAnswer("");
      return true;
    } catch (err) {
      toast.error(err.message || "An error occurred while saving your answer.");
      return false;
    } finally {
      setLoading(false);
    }
  }, [activeQuestionIndex, interviewData, mockInterviewQuestion]);

  const transcribeAudio = useCallback(async (audioBlob) => {
    try {
      setLoading(true);
      // Convert blob to base64 and send to a transcription endpoint
      const formData = new FormData();
      const ext = audioBlob.type.includes("mp4") ? "mp4" : "webm";
      formData.append("audio", audioBlob, `recording.${ext}`);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Transcription failed");

      const { transcription } = await res.json();
      const updatedAnswer = (userAnswer + " " + transcription).trim();
      setUserAnswer(updatedAnswer);
      // Save once transcription is done
      await saveAnswer(updatedAnswer);
    } catch {
      toast.error("Error transcribing audio. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userAnswer, saveAnswer]);

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
        // Stop all tracks to release the mic
        stream.getTracks().forEach((t) => t.stop());
        await transcribeAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch {
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center overflow-hidden">
      <div className="flex flex-col justify-center items-center rounded-lg p-5 bg-black mt-4 w-full max-w-[30rem]">
        {webCamEnabled ? (
          <Webcam
            mirrored={true}
            style={{ height: 250, width: "100%", zIndex: 10 }}
          />
        ) : (
          <Image
            src="/camera.jpg"
            width={200}
            height={200}
            alt="Camera placeholder — enable webcam to see your video feed"
          />
        )}
      </div>

      {userAnswer && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg w-full max-w-[30rem] text-sm text-gray-700">
          <strong>Your answer:</strong> {userAnswer}
        </div>
      )}

      <div className="md:flex mt-4 md:mt-8 md:gap-5">
        <div className="my-4 md:my-0">
          <Button onClick={() => setWebCamEnabled((prev) => !prev)}>
            {webCamEnabled ? "Close WebCam" : "Enable WebCam"}
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={loading}
        >
          {isRecording ? (
            <span className="text-red-400 flex gap-2 items-center">
              <Mic /> Stop Recording...
            </span>
          ) : loading ? (
            "Saving..."
          ) : (
            "Record Answer"
          )}
        </Button>
      </div>

      <div className="mt-4 w-full max-w-[30rem] text-center">
        {!showTyping ? (
          <button
            type="button"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            onClick={() => setShowTyping(true)}
          >
            No microphone? Type your answer instead
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <Textarea
              rows={4}
              placeholder="Type your answer here..."
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              disabled={loading}
            />
            <Button
              onClick={async () => {
                if (await saveAnswer(typedAnswer)) setTypedAnswer("");
              }}
              disabled={loading || isRecording}
            >
              {loading ? "Saving..." : "Submit Typed Answer"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordAnswerSection;
