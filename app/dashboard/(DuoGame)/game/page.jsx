"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Trophy,
  Zap,
  Loader2,
  Check,
  X,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Network,
  Wifi,
  Boxes,
  MessageSquare,
} from "lucide-react";
import {
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiPython,
  SiLeetcode,
  SiMysql,
  SiHtml5,
  SiTypescript,
  SiLinux,
  SiGit,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { QUIZ_TOPICS } from "@/utils/quizTopics";
import { saveQuizResult } from "@/actions/quiz";

const START_HEARTS = 5;
const POINTS_PER_CORRECT = 10;

// Brand logos (with brand colors) for each topic; conceptual topics use accent-colored icons.
const ACCENT = "#2563eb";
const TOPIC_META = {
  "JavaScript": { Icon: SiJavascript, color: "#F7DF1E" },
  "React": { Icon: SiReact, color: "#61DAFB" },
  "Node.js": { Icon: SiNodedotjs, color: "#5FA04E" },
  "Python": { Icon: SiPython, color: "#3776AB" },
  "Data Structures & Algorithms": { Icon: SiLeetcode, color: "#FFA116" },
  "System Design": { Icon: Network, color: ACCENT },
  "SQL & Databases": { Icon: SiMysql, color: "#4479A1" },
  "HTML & CSS": { Icon: SiHtml5, color: "#E34F26" },
  "TypeScript": { Icon: SiTypescript, color: "#3178C6" },
  "Operating Systems": { Icon: SiLinux, color: "#F5A623" },
  "Computer Networks": { Icon: Wifi, color: ACCENT },
  "OOP Concepts": { Icon: Boxes, color: ACCENT },
  "Git & DevOps": { Icon: SiGit, color: "#F05032" },
  "Java": { Icon: FaJava, color: "#E76F00" },
  "Behavioral": { Icon: MessageSquare, color: ACCENT },
};

const QuizArena = () => {
  const [phase, setPhase] = useState("select"); // select | loading | play | result
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [hearts, setHearts] = useState(START_HEARTS);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [savedTotals, setSavedTotals] = useState(null);
  const [saveFailed, setSaveFailed] = useState(false);
  const savedRef = useRef(false);

  const startQuiz = async (topicName) => {
    setTopic(topicName);
    setPhase("loading");
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate quiz");

      setQuestions(data.questions);
      setIndex(0);
      setSelected(null);
      setLocked(false);
      setHearts(START_HEARTS);
      setPoints(0);
      setStreak(0);
      setCorrectCount(0);
      setSavedTotals(null);
      setSaveFailed(false);
      savedRef.current = false;
      setPhase("play");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
      setPhase("select");
    }
  };

  const current = questions[index];

  const onAnswer = (optionIndex) => {
    if (locked) return;
    setSelected(optionIndex);
    setLocked(true);

    const isCorrect = optionIndex === current.answer;
    if (isCorrect) {
      const bonus = streak >= 2 ? 5 : 0; // streak bonus
      setPoints((p) => p + POINTS_PER_CORRECT + bonus);
      setStreak((s) => s + 1);
      setCorrectCount((c) => c + 1);
    } else {
      setStreak(0);
      setHearts((h) => h - 1);
    }
  };

  const onNext = () => {
    const outOfHearts = hearts <= 0;
    const lastQuestion = index >= questions.length - 1;
    if (outOfHearts || lastQuestion) {
      setPhase("result");
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setLocked(false);
  };

  // Persist the result once when the game ends
  useEffect(() => {
    if (phase === "result" && !savedRef.current) {
      savedRef.current = true;
      saveQuizResult(points)
        .then(setSavedTotals)
        .catch(() => setSaveFailed(true));
    }
  }, [phase, points]);

  /* ------------------------------- SELECT ------------------------------- */
  if (phase === "select") {
    return (
      <div className="mx-auto max-w-4xl py-8">
        <div className="mb-8 text-center">
          <div className="glass-card mx-auto mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent" /> AI-generated questions
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">AI Quiz Arena</h1>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Pick a topic and race through AI-generated interview questions. Answer
            correctly to earn points and keep your hearts. Climb the leaderboard!
          </p>
          <div className="mt-4">
            <Link href="/dashboard/leaderboard">
              <Button variant="superOutline" size="sm">
                <Trophy className="mr-2 h-4 w-4" /> Leaderboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-4">
          {QUIZ_TOPICS.map((t) => {
            const meta = TOPIC_META[t.name];
            const Icon = meta?.Icon ?? Sparkles;
            const color = meta?.color ?? ACCENT;
            return (
              <button
                key={t.name}
                onClick={() => startQuiz(t.name)}
                className="glass-card flex h-28 w-[8.25rem] flex-col items-center justify-center gap-2.5 rounded-2xl p-3 text-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg sm:h-32 sm:w-36 sm:gap-3 sm:p-4"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl sm:h-14 sm:w-14"
                  style={{ backgroundColor: `${color}1f` }}
                >
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" style={{ color }} />
                </span>
                <span className="text-xs font-medium leading-tight sm:text-sm">{t.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ------------------------------- LOADING ------------------------------ */
  if (phase === "loading") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
        <p className="text-muted-foreground">Generating your {topic} quiz…</p>
      </div>
    );
  }

  /* ------------------------------- RESULT ------------------------------- */
  if (phase === "result") {
    const accuracy = questions.length
      ? Math.round((correctCount / questions.length) * 100)
      : 0;
    return (
      <div className="mx-auto max-w-lg py-12">
        <div className="glass-card rounded-3xl p-8 text-center">
          <Trophy className="mx-auto mb-3 h-14 w-14 text-amber-500" />
          <h2 className="text-2xl font-bold">
            {hearts > 0 ? "Quiz Complete!" : "Out of Hearts!"}
          </h2>
          <p className="mt-1 text-muted-foreground">Topic: {topic}</p>

          <div className="my-6 grid grid-cols-3 gap-3">
            <div className="glass rounded-xl p-4">
              <p className="text-2xl font-bold text-accent">{points}</p>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-2xl font-bold">
                {correctCount}/{questions.length}
              </p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-2xl font-bold">{accuracy}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
          </div>

          {savedTotals ? (
            <p className="mb-6 text-sm text-muted-foreground">
              Total points: <strong className="text-foreground">{savedTotals.points}</strong>{" "}
              · Best game: <strong className="text-foreground">{savedTotals.bestScore}</strong>
            </p>
          ) : (
            <p className="mb-6 text-sm text-muted-foreground">
              {saveFailed ? "Could not save your score this time." : "Saving your score…"}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => setPhase("select")}>
              <RotateCcw className="mr-2 h-4 w-4" /> Play Again
            </Button>
            <Link href="/dashboard/leaderboard">
              <Button variant="superOutline" className="w-full">
                <Trophy className="mr-2 h-4 w-4" /> Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------- PLAY -------------------------------- */
  const progress = ((index + (locked ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-2xl py-6">
      {/* HUD */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-y-2">
        <span className="text-xs font-medium text-muted-foreground sm:text-sm">
          Question {index + 1} / {questions.length}
        </span>
        <div className="flex items-center gap-2 sm:gap-4">
          {streak >= 2 && (
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-500 sm:text-sm">
              <Zap className="h-4 w-4" /> {streak}
              <span className="hidden sm:inline">&nbsp;streak</span>
            </span>
          )}
          <span className="flex items-center gap-1 text-xs font-semibold text-accent sm:text-sm">
            <Sparkles className="h-4 w-4" /> {points}
          </span>
          <span className="flex items-center gap-0.5">
            {Array.from({ length: START_HEARTS }).map((_, i) => (
              <Heart
                key={i}
                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${i < hearts ? "fill-rose-500 text-rose-500" : "text-muted-foreground/30"}`}
              />
            ))}
          </span>
        </div>
      </div>

      {/* progress bar */}
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold">{current.question}</h2>
            <div className="mt-5 grid gap-3">
              {current.options.map((opt, i) => {
                const isCorrect = i === current.answer;
                const isChosen = i === selected;
                let style =
                  "border-border bg-background/50 hover:border-accent/50 hover:bg-secondary";
                if (locked && isCorrect) style = "border-green-500 bg-green-500/10 text-green-700";
                else if (locked && isChosen && !isCorrect)
                  style = "border-rose-500 bg-rose-500/10 text-rose-700";
                else if (locked) style = "border-border bg-background/50 opacity-60";

                return (
                  <button
                    key={i}
                    disabled={locked}
                    onClick={() => onAnswer(i)}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm transition-all ${style}`}
                  >
                    <span>{opt}</span>
                    {locked && isCorrect && <Check className="h-5 w-5 shrink-0 text-green-600" />}
                    {locked && isChosen && !isCorrect && (
                      <X className="h-5 w-5 shrink-0 text-rose-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {locked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 rounded-xl border border-border bg-secondary/40 p-3 text-sm text-muted-foreground"
              >
                <strong className="text-foreground">
                  {selected === current.answer ? "Correct! " : "Not quite. "}
                </strong>
                {current.explanation}
              </motion.div>
            )}

            {locked && (
              <div className="mt-5 flex justify-end">
                <Button onClick={onNext}>
                  {hearts <= 0 || index >= questions.length - 1 ? "See Results" : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizArena;
