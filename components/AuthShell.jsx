import Link from "next/link";
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
        <div className="relative hidden flex-col justify-between gap-10 bg-gradient-to-br from-primary via-primary to-accent p-10 text-white lg:flex">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Mock<span className="text-white/80">Mate</span>
          </Link>
          <div>
            <h2 className="text-3xl font-bold leading-tight">Master your next interview.</h2>
            <p className="mt-3 max-w-sm text-white/80">
              Practice smarter with AI mock interviews, resume analysis, and a
              competitive quiz arena.
            </p>
            <ul className="mt-8 space-y-3">
              {highlights.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-white/90">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                    <Icon className="h-4 w-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-white/60">© 2026 MockMate. Crafted by Chirag Attri.</p>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-sm">
            <Link href="/" className="mb-6 block text-center text-xl font-bold lg:hidden">
              Mock<span className="text-accent">Mate</span>
            </Link>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
