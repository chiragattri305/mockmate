import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider
} from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/ThemeProvider.tsx"

const sans = Inter({ subsets: ["latin"], display: "swap", variable: "--font-sans" });
const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  axes: ["opsz", "SOFT"],
});

export const metadata = {
  title: {
    default: "MockMate",
    template: "%s | MockMate",
  },
  description:
    "MockMate — practice with AI-powered mock interviews, upload your resume for tailored questions, and get instant personalized feedback with visual analytics.",
  keywords: ["mock interview", "AI interview", "interview practice", "job interview prep", "resume analysis", "MockMate"],
};


export default function RootLayout({ children }) {
  return (

    <ClerkProvider >
      <html lang="en" suppressHydrationWarning>
        <body className={`${sans.variable} ${display.variable} font-sans`}>
          <Toaster />
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          </body>
      </html>
    </ClerkProvider>
  );
}
