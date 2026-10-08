import { UserButton } from "@clerk/nextjs";
import React from "react";
import AddQuestions from "../_components/AddQuestions";
import QuestionList from "../_components/QuestionList";

const Questions = () => {
  return (
    <div className="py-8 md:py-12">
      <h1 className="font-display text-3xl md:text-4xl">Master your interviews</h1>
      <p className="mt-2 text-muted-foreground">Comprehensive question preparation with AI</p>

      <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AddQuestions/>
      </div>

      <QuestionList/>
    </div>
  );
};

export default Questions;