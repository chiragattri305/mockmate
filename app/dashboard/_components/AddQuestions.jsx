"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AddQuestions = () => {
  const [openDailog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [typeQuestion, setTypeQuestion] = useState("");
  const [company, setCompany] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (setState) => (e) => {
    setState(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobPosition,
          jobDesc,
          typeQuestion,
          company,
          jobExperience,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate questions");
      }

      if (data.mockId) {
        setOpenDialog(false);
        router.push("/dashboard/pyq/" + data.mockId);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "There was an error processing the data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="group flex h-full min-h-[150px] w-full cursor-pointer flex-col justify-between rounded-2xl bg-foreground p-5 text-left text-background transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onClick={() => setOpenDialog(true)}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground text-xl transition-transform duration-200 group-hover:rotate-90">
          +
        </span>
        <span>
          <span className="block font-display text-xl">New question set</span>
          <span className="mt-0.5 block text-sm opacity-70">Role, company &amp; question type</span>
        </span>
      </button>

      <Dialog open={openDailog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-normal">What questions are you preparing for?</DialogTitle>
            <DialogDescription asChild>
              <form onSubmit={onSubmit}>
                <div className="my-3 text-foreground">
                  <h2>
                    Add Details about your job position, job description and
                    years of experience
                  </h2>

                  <div className="mt-7 my-3">
                    <label className="text-sm font-medium text-foreground">Job Role / Job Position</label>
                    <Input
                      className="mt-1"
                      value={jobPosition}
                      placeholder="Ex. Full stack Developer"
                      required
                      onChange={handleInputChange(setJobPosition)}
                    />
                  </div>
                  <div className="my-4">
                    <label className="text-sm font-medium text-foreground">
                      Job Description / Tech stack (In Short)
                    </label>
                    <Textarea
                      className="placeholder-opacity-50 mt-1"
                      value={jobDesc}
                      placeholder="Ex. React, Angular, Nodejs, Mysql, Nosql, Python"
                      required
                      onChange={handleInputChange(setJobDesc)}
                    />
                  </div>
                  <div className="my-4">
                    <label className="text-sm font-medium text-foreground">
                      Type of Questions (In Short)
                    </label>
                    <Input
                      className="placeholder-opacity-50 mt-1"
                      value={typeQuestion}
                      placeholder="Ex. CPP, Leetcode, Domain based"
                      required
                      onChange={handleInputChange(setTypeQuestion)}
                    />
                  </div>
                  <div className="my-4">
                    <label className="text-sm font-medium text-foreground">
                      Company you are seeking
                    </label>
                    <Input
                      className="mt-1"
                      value={company}
                      placeholder="Ex. Microsoft, Apple, Google, Mercedes"
                      required
                      onChange={handleInputChange(setCompany)}
                    />
                  </div>
                  <div className="my-4">
                    <label className="text-sm font-medium text-foreground">Years of Experience</label>
                    <Input
                      className="mt-1"
                      placeholder="Ex. 5"
                      value={jobExperience}
                      max="50"
                      type="number"
                      required
                      onChange={handleInputChange(setJobExperience)}
                    />
                  </div>
                </div>
                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin mr-2" />
                        Generating From AI
                      </>
                    ) : (
                      "Prep. Questions"
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

export default AddQuestions;
