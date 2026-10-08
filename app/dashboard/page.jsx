import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import InterviewList from "./_components/InterviewList";

const greeting = () => {
  const hour = Number(
    new Intl.DateTimeFormat("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date())
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const Dashboard = async () => {
  const user = await currentUser();

  return (
    <div className="py-8 md:py-12">
      <p className="eyebrow">Dashboard</p>
      <h1 className="mt-2 font-display text-3xl md:text-4xl">
        {greeting()}
        {user?.firstName ? `, ${user.firstName}` : ""}.
      </h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Pick up where you left off, or set up a new mock interview for the role you&apos;re targeting.
      </p>

      <div className="mt-8">
        <InterviewList />
      </div>
    </div>
  );
};

export default Dashboard;
