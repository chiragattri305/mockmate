"use client";
import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, FileText, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const clearForm = () => {
    setJobPosition("");
    setJobDesc("");
    setJobExperience("");
    setResumeFile(null);
    setError("");
  };

  const onResumeChange = (e) => {
    const file = e.target.files?.[0];
    setError("");
    if (!file) {
      setResumeFile(null);
      return;
    }
    if (file.type !== "application/pdf") {
      setError("Resume must be a PDF file.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Resume must be under 4MB.");
      return;
    }
    setResumeFile(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let res;
      if (resumeFile) {
        // Send as multipart so the AI can read the resume alongside the job details
        const formData = new FormData();
        formData.append("jobPosition", jobPosition);
        formData.append("jobDesc", jobDesc);
        formData.append("jobExperience", jobExperience);
        formData.append("resume", resumeFile);
        res = await fetch("/api/interviews", { method: "POST", body: formData });
      } else {
        res = await fetch("/api/interviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobPosition, jobDesc, jobExperience }),
        });
      }

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Failed to create interview. Please try again.");
        return;
      }

      setOpenDialog(false);
      clearForm();
      router.push("/dashboard/interview/" + data.mockId);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="glass-card group flex min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-2xl p-10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
        onClick={() => setOpenDialog(true)}
      >
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
          <Plus className="h-6 w-6" />
        </div>
        <h2 className="text-center text-lg font-medium">Add New Interview</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={(open) => !loading && setOpenDialog(open)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interview
            </DialogTitle>
            <DialogDescription asChild>
              <form onSubmit={onSubmit}>
                <div className="my-3">
                  <p className="text-sm text-muted-foreground">
                    Add details about your job position, job description and years
                    of experience. Optionally upload your resume for tailored
                    questions and a fit analysis.
                  </p>

                  {error && (
                    <div className="mt-4 rounded-lg border border-red-400 bg-red-100/80 p-3 text-red-700">
                      {error}
                    </div>
                  )}

                  <div className="my-3 mt-7">
                    <label className="text-foreground">Job Role/Job Position</label>
                    <Input
                      className="mt-1"
                      placeholder="Ex. Full Stack Developer"
                      value={jobPosition}
                      required
                      onChange={(e) => {
                        setJobPosition(e.target.value);
                        setError("");
                      }}
                    />
                  </div>
                  <div className="my-5">
                    <label className="text-foreground">
                      Job Description/Tech Stack (In Short)
                    </label>
                    <Textarea
                      className="placeholder-opacity-50"
                      placeholder="Ex. React, Angular, Node.js, MySQL, NoSQL, Python"
                      value={jobDesc}
                      required
                      onChange={(e) => {
                        setJobDesc(e.target.value);
                        setError("");
                      }}
                    />
                  </div>
                  <div className="my-5">
                    <label className="text-foreground">Years of Experience</label>
                    <Input
                      className="mt-1"
                      placeholder="Ex. 5"
                      min="0"
                      max="50"
                      type="number"
                      value={jobExperience}
                      required
                      onChange={(e) => {
                        setJobExperience(e.target.value);
                        setError("");
                      }}
                    />
                  </div>

                  <div className="my-5">
                    <label className="text-foreground">
                      Resume (PDF, optional)
                    </label>
                    {resumeFile ? (
                      <div className="mt-1 flex items-center justify-between rounded-lg border border-border bg-secondary/60 p-3">
                        <span className="flex items-center gap-2 text-sm text-foreground">
                          <FileText className="h-4 w-4 text-primary" />
                          {resumeFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setResumeFile(null)}
                          className="rounded-full p-1 text-muted-foreground hover:bg-black/5 hover:text-foreground"
                          aria-label="Remove resume"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="mt-1 flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-secondary/30 p-5 text-center text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary/50">
                        <FileText className="h-5 w-5" />
                        <span>Click to upload your resume (PDF, max 4MB)</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={onResumeChange}
                        />
                      </label>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-5">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setOpenDialog(false);
                      clearForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="mr-2 animate-spin" />
                        Generating From AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
