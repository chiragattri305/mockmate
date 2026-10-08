import React from 'react'
import Contect from './_components/Contect';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { ArrowRight, Check, SkipForward, Circle, Mic } from 'lucide-react';

export const metadata = {
  title: 'MockMate — AI Mock Interview Platform',
  description: 'Ace your next interview with AI-powered mock interviews, resume-tailored questions, and personalized feedback with visual analytics.',
};

const steps = [
  {
    title: 'Describe the role',
    desc: 'Add the job title, the stack and your experience. Attach your resume if you want questions built around what you have actually done.',
  },
  {
    title: 'Answer out loud — or type',
    desc: 'Role-specific questions, one at a time. Speak your answer like the real thing, skip and come back, or pause and resume later.',
  },
  {
    title: 'Get scored on every answer',
    desc: 'Each answer is rated out of 10 with specific feedback and a model answer to compare against.',
  },
  {
    title: 'See where you stand',
    desc: 'A report with charts across all questions shows your strongest areas and what to work on before the real interview.',
  },
];

const testimonials = [
  {
    quote:
      'The AI mock interviews were incredibly helpful. I felt much more confident going into my real interview.',
    name: 'Aniket Kundal',
  },
  {
    quote:
      'The feedback was spot on and the resume analysis showed exactly what to prepare. Highly recommend!',
    name: 'Gautam Lasgotra',
  },
];

const waveform = [40, 70, 30, 90, 55, 75, 35, 60, 85, 45, 65, 30, 80, 50, 70, 40];

const navLink =
  'hidden rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block';

const page = () => {
  return (
    <>
      <main className="min-h-screen">
        {/* Header */}
        <header className="glass-nav sticky top-0 z-50 w-full">
          <div className="mx-auto flex w-[90%] max-w-6xl items-center justify-between py-3">
            <Link href="/" aria-label="MockMate home">
              <Logo />
            </Link>
            <nav className="flex items-center gap-1 sm:gap-2">
              <a href="#how" className={navLink}>How it works</a>
              <a href="#testimonials" className={navLink}>Reviews</a>
              <a href="#contact" className={navLink}>Contact</a>
              <Link
                href="/dashboard"
                className="ml-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Open dashboard
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto grid w-[90%] max-w-6xl grid-cols-1 items-center gap-14 py-16 md:py-24 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="eyebrow">AI mock interviews</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              Rehearse the interview <span className="italic text-accent">before</span> it counts.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              MockMate asks the questions a real interviewer would for your role, listens to your answers,
              and tells you exactly what to improve — tailored to your resume if you share it.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-base font-medium text-accent-foreground transition-opacity hover:opacity-90"
              >
                Start practising <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center justify-center rounded-full border px-7 py-3 text-base font-medium transition-colors hover:bg-secondary"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Product preview */}
          <div className="relative" aria-hidden="true">
            <div className="glass-card rounded-3xl p-5 sm:p-7">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success/10 px-3 py-1 text-xs font-medium text-success"><Check className="h-3 w-3" />Q1</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-success/40 bg-success/10 px-3 py-1 text-xs font-medium text-success"><Check className="h-3 w-3" />Q2</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-warning/50 bg-warning/10 px-3 py-1 text-xs font-medium text-warning"><SkipForward className="h-3 w-3" />Q3</span>
                <span className="inline-flex items-center rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">Q4</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-danger/40 bg-danger/5 px-3 py-1 text-xs font-medium text-danger"><Circle className="h-3 w-3" />Q5</span>
              </div>
              <p className="eyebrow mt-7">Question 4 of 5</p>
              <p className="mt-2 font-display text-xl leading-snug sm:text-2xl">
                How would you prevent unnecessary re-renders in a large React list?
              </p>
              <div className="mt-7 flex items-center gap-4 rounded-2xl bg-secondary p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Mic className="h-5 w-5" />
                </span>
                <div className="flex h-8 flex-1 items-center justify-between">
                  {waveform.map((h, i) => (
                    <span key={i} className="w-1 shrink-0 rounded-full bg-foreground/30" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-3 hidden rounded-2xl border bg-card px-5 py-3 shadow-lg sm:block">
              <p className="text-xs text-muted-foreground">Last answer</p>
              <p className="font-display text-2xl text-success">8/10</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t py-20">
          <div className="mx-auto grid w-[90%] max-w-6xl gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">From job description to feedback in minutes.</h2>
            </div>
            <ol className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {steps.map(({ title, desc }, i) => (
                <li key={title} className="border-t pt-5">
                  <span className="font-display text-sm text-accent">0{i + 1}</span>
                  <h3 className="mt-2 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="border-t py-20">
          <div className="mx-auto w-[90%] max-w-6xl">
            <p className="eyebrow">Reviews</p>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">What people say</h2>
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
              {testimonials.map((t) => (
                <figure key={t.name} className="glass-card rounded-2xl p-7">
                  <blockquote className="font-display text-xl leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-5 text-sm font-medium text-muted-foreground">— {t.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="border-t py-20">
          <Contect />
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 MockMate. Crafted by Chirag Attri. All rights reserved.</p>
      </footer>
    </>
  )
}

export default page
