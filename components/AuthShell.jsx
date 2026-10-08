import Link from "next/link";
import Logo from "@/components/Logo";
import { Sparkles, FileText, BarChart3, Trophy } from "lucide-react";

const highlights = [
  { icon: Sparkles, text: "AI-generated, role-specific questions" },
  { icon: FileText, text: "Resume-tailored interviews & fit analysis" },
  { icon: BarChart3, text: "Instant feedback with visual analytics" },
  { icon: Trophy, text: "Compete in the AI Quiz Arena" },
];

// Glassmorphic two-panel shell used by both the sign-in and sign-up pages
// so the auth experience is uniform and on-brand with the rest of the site.
export default function AuthShell({ children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl glass-card lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between gap-10 bg-foreground p-10 text-background lg:flex">
          <Link href="/" aria-label="MockMate home">
            <Logo inverted className="text-2xl" markClassName="h-8 w-8" />
          </Link>
          <div>
            <h2 className="font-display text-4xl leading-tight">Rehearse the interview <span className="italic text-accent">before</span> it counts.</h2>
            <p className="mt-3 max-w-sm text-background/70">
              Practice smarter with AI mock interviews, resume analysis, and a
              competitive quiz arena.
            </p>
            <ul className="mt-8 space-y-3">
              {highlights.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-background/90">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background/10">
                    <Icon className="h-4 w-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-background/60">© 2026 MockMate. Crafted by Chirag Attri.</p>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-sm">
            <Link href="/" className="mb-6 flex justify-center lg:hidden" aria-label="MockMate home">
              <Logo />
            </Link>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
