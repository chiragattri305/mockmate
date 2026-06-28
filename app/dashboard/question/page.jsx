import { UserButton } from "@clerk/nextjs";
import React from "react";
import AddQuestions from "../_components/AddQuestions";
import QuestionList from "../_components/QuestionList";

const Questions = () => {
  return (
    <div className="p-4 sm:p-6 md:p-10" >
      <h2 className="font-bold text-2xl tracking-tight" >Master Your Interviews</h2>
      <h2 className="text-muted-foreground" >Comprehensive Question Preparation with AI</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 my-5" >
        <AddQuestions/>
      </div>

      <QuestionList/>
    </div>
  );
};

export default Questions;