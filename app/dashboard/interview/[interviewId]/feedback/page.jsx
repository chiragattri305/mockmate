"use client";
import React, { useEffect, useState, useMemo } from "react";
import { ChevronDown, Trophy, TrendingUp, Star } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

const ratingColor = (rating) => {
  if (rating >= 7) return "#16a34a";
  if (rating >= 4) return "#d97706";
  return "#dc2626";
};

const Feedback = ({ params }) => {
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`/api/interviews/${params.interviewId}/feedback`);
      if (!res.ok) throw new Error("Failed to fetch feedback");
      const data = await res.json();
      setFeedbackList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const overallRating = useMemo(() => {
    if (feedbackList && feedbackList.length > 0) {
      const total = feedbackList.reduce((sum, item) => sum + (Number(item.rating) || 0), 0);
      return Number((total / feedbackList.length).toFixed(1));
    }
    return 0;
  }, [feedbackList]);

  const chartData = useMemo(
    () =>
      feedbackList.map((item, i) => ({
        name: `Q${i + 1}`,
        rating: Number(item.rating) || 0,
      })),
    [feedbackList]
  );

  const gaugeData = [{ name: "score", value: overallRating, fill: ratingColor(overallRating) }];

  if (loading) {
    return <div className="p-10 text-muted-foreground">Loading your feedback...</div>;
  }

  return (
    <div className="mx-auto max-w-5xl py-8 md:py-12">
      {feedbackList.length === 0 ? (
        <h2 className="my-5 text-xl font-semibold text-muted-foreground">
          No interview feedback record found.
        </h2>
      ) : (
        <>
          {/* Header */}
          <div className="mb-8">
            <p className="eyebrow flex items-center gap-2">
              <Trophy className="h-4 w-4 text-accent" /> Interview report
            </p>
            <h1 className="mt-2 font-display text-3xl md:text-4xl">Here&apos;s how you did</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Review your overall performance, then expand each question to see your
              answer, the ideal answer, and tailored feedback.
            </p>
          </div>

          {/* Stat cards + charts */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Overall score gauge */}
            <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-6">
              <p className="mb-1 text-sm font-medium text-muted-foreground">Overall Rating</p>
              <div className="relative h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="72%"
                    outerRadius="100%"
                    data={gaugeData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 10]} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={20} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="text-4xl font-bold"
                    style={{ color: ratingColor(overallRating) }}
                  >
                    {overallRating}
                  </span>
                  <span className="text-sm text-muted-foreground">/ 10</span>
                </div>
              </div>
            </div>

            {/* Per-question bar chart */}
            <div className="glass-card rounded-2xl p-6 lg:col-span-2">
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4" /> Rating by question
              </p>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis domain={[0, 10]} tickLine={false} axisLine={false} fontSize={12} />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid hsl(var(--border))",
                        background: "hsl(var(--popover))",
                        fontSize: 13,
                      }}
                    />
                    <Bar dataKey="rating" radius={[8, 8, 0, 0]} maxBarSize={48}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={ratingColor(entry.rating)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Summary table */}
          <div className="glass-card mt-6 overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-muted-foreground">
                  <tr>
                    <th className="px-3 py-3 font-medium sm:px-5">#</th>
                    <th className="px-3 py-3 font-medium sm:px-5">Question</th>
                    <th className="px-3 py-3 font-medium sm:px-5">Rating</th>
                    <th className="px-3 py-3 font-medium sm:px-5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackList.map((item, index) => {
                    const r = Number(item.rating) || 0;
                    return (
                      <tr key={index} className="border-b border-border/60 last:border-0">
                        <td className="px-3 py-3 text-muted-foreground sm:px-5">{index + 1}</td>
                        <td className="max-w-[130px] truncate px-3 py-3 sm:max-w-md sm:px-5">{item.question}</td>
                        <td className="px-3 py-3 font-semibold sm:px-5" style={{ color: ratingColor(r) }}>
                          {r}/10
                        </td>
                        <td className="px-3 py-3 sm:px-5">
                          <span
                            className="rounded-full px-2.5 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: `${ratingColor(r)}1a`,
                              color: ratingColor(r),
                            }}
                          >
                            {r >= 7 ? "Strong" : r >= 4 ? "Fair" : "Needs work"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed feedback */}
          <h3 className="mb-2 mt-10 flex items-center gap-2 font-display text-2xl">
            <Star className="h-5 w-5 text-accent" /> Detailed feedback
          </h3>
          {feedbackList.map((item, index) => (
            <Collapsible key={index} className="mt-3">
              <CollapsibleTrigger className="glass-card flex w-full items-center justify-between gap-3 rounded-xl p-4 text-left transition-colors hover:bg-secondary/40 sm:gap-7">
                <span className="font-medium">{item.question}</span>
                <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 flex flex-col gap-2">
                  <div className="rounded-xl border border-border p-3 text-sm">
                    <strong style={{ color: ratingColor(Number(item.rating) || 0) }}>
                      Rating:{" "}
                    </strong>
                    {item.rating}/10
                  </div>
                  <div className="rounded-xl border-l-4 border-l-muted-foreground/40 bg-secondary p-3 text-sm">
                    <strong>Your Answer: </strong>
                    {item.userAns}
                  </div>
                  <div className="rounded-xl border-l-4 border-l-success bg-success/10 p-3 text-sm">
                    <strong>Ideal Answer: </strong>
                    {item.correctAns}
                  </div>
                  <div className="rounded-xl border-l-4 border-l-accent bg-accent/10 p-3 text-sm">
                    <strong>Feedback: </strong>
                    {item.feedback}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </>
      )}
      <div className="mt-10 flex flex-wrap gap-3">
        <Button onClick={() => router.replace("/dashboard")}>Back to dashboard</Button>
        <Button variant="outline" onClick={() => router.push(`/dashboard/interview/${params.interviewId}/start`)}>
          Continue answering
        </Button>
      </div>
    </div>
  );
};

export default Feedback;
