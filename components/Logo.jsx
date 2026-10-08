import React from "react";

// MockMate mark: a speech-bubble tile (the interview conversation) with an "M"
// and a live "recording" dot. Colours follow the theme tokens, so it inverts in dark mode.
export const LogoMark = ({ className = "h-7 w-7", inverted = false }) => {
  const tile = inverted ? "hsl(var(--background))" : "hsl(var(--foreground))";
  const letter = inverted ? "hsl(var(--foreground))" : "hsl(var(--background))";
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        d="M8 1.5h16A6.5 6.5 0 0 1 30.5 8v12a6.5 6.5 0 0 1-6.5 6.5H13l-6.2 4.6a.6.6 0 0 1-.96-.48V26.3A6.5 6.5 0 0 1 1.5 20V8A6.5 6.5 0 0 1 8 1.5z"
        fill={tile}
      />
      <path
        d="M8 19.5V9.5l6 6.5 6-6.5v10"
        fill="none"
        stroke={letter}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="25.3" cy="7.8" r="2.4" fill="hsl(var(--accent))" />
    </svg>
  );
};

const Logo = ({ className = "", markClassName, inverted = false }) => (
  <span className={`inline-flex items-center gap-2 font-display text-xl ${className}`}>
    <LogoMark className={markClassName} inverted={inverted} />
    MockMate
  </span>
);

export default Logo;
