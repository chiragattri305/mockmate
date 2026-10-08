"use client";
import React, { useEffect, useState } from "react";
import QuestionItemCard from "./QuestionItemCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const QuestionList = () => {
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetQuestionList();
  }, []);

  const GetQuestionList = async () => {
    try {
      const res = await fetch("/api/questions/list");
      if (!res.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await res.json();
      setQuestionList(data);
    } catch (error) {
      console.error(error);
      toast.error("Could not load previous mock questions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="my-10 flex flex-col gap-5">
        <Skeleton className="h-40 w-full rounded-2xl sm:w-[20rem]" />
        <Skeleton className="h-40 w-full rounded-2xl sm:w-[20rem]" />
      </div>
    );
  }

  return (
    <div>
      {questionList.length > 0 ? (
        <>
          <h2 className="font-display text-2xl">Your question sets</h2>
          <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {questionList.map((question, index) => (
              <QuestionItemCard key={index} question={question} />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          <p>No question sets yet. Create one above to start studying.</p>
        </div>
      )}
    </div>
  );
};

export default QuestionList;
