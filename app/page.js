import React from 'react'
import Contect from './_components/Contect';
import Link from 'next/link';
import { Sparkles, Zap, BarChart3, FileText } from 'lucide-react';

export const metadata = {
  title: 'MockMate — AI Mock Interview Platform',
  description: 'Ace your next interview with AI-powered mock interviews, resume-tailored questions, and personalized feedback with visual analytics.',
};

const features = [
  {
    icon: Sparkles,
    title: 'AI Mock Interviews',
    desc: 'Experience realistic, role-specific interview scenarios powered by advanced AI.',
  },
  {
    icon: FileText,
    title: 'Resume-Tailored Questions',
    desc: 'Upload your resume and get questions matched to your real background, with a fit analysis.',
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    desc: 'Get immediate, personalized feedback on every answer to sharpen your performance.',
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    desc: 'Track your performance with graphical reports highlighting strengths and gaps.',
  },
];

const testimonials = [
  {
    quote:
      'The AI mock interviews were incredibly helpful. I felt much more confident going into my real interview.',
    name: 'Alex Johnson',
  },
  {
    quote:
      'The feedback was spot on and the resume analysis showed exactly what to prepare. Highly recommend!',
    name: 'Sarah Williams',
  },
];

const page = () => {
  return (
    <>
      <main className="min-h-screen">
        {/* Header Section */}
        <header className="glass-nav sticky top-0 z-50 w-full">
          <div className="container mx-auto flex flex-col items-center justify-between px-6 py-4 md:flex-row">
            <h1 className="text-2xl font-bold tracking-tight">
              Mock<span className="text-accent">Mate</span>
            </h1>
            <nav className="mt-3 flex flex-wrap items-center justify-center gap-4 md:mt-0">
              <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</a>
              <a href="#testimonials" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Testimonials</a>
              <a href="#contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Contact</a>
              <Link
                href="/dashboard"
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-105"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center px-6 py-28 text-center md:py-36">
          <div className="glass-card mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            Powered by AI
          </div>
          <h2 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Ace Your Next <span className="text-gradient">Interview</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Practice with AI-powered mock interviews, get resume-tailored questions, and
            receive personalized feedback with visual analytics.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="rounded-full bg-primary px-7 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="glass-card rounded-full px-7 py-3 text-base font-semibold transition-transform hover:scale-105"
            >
              Learn More
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Features</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Everything you need to walk into your interview prepared.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="glass-card rounded-2xl p-6 text-left transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="px-6 py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold md:text-4xl">What Our Users Say</h2>
            <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
              {testimonials.map((t) => (
                <div key={t.name} className="glass-card rounded-2xl p-7 text-left">
                  <p className="text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                  <h4 className="mt-4 font-semibold text-accent">— {t.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="px-6 py-20">
          <Contect />
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 MockMate. Crafted by Chirag Attri. All rights reserved.</p>
      </footer>
    </>
  )
}

export default page
