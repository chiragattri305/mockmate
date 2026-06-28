import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";

const Dashboard = () => {
  return (
    <div className="p-6 md:p-10">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p className="mt-1 text-muted-foreground">
        Create and start your AI-powered mock interview
      </p>

      <div className="my-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <AddNewInterview />
      </div>

      <InterviewList />
    </div>
  );
};

export default Dashboard;
