// Shared Clerk appearance so the Clerk <SignIn/> and <SignUp/> widgets blend
// into our glassmorphism auth card instead of looking like a boxed third-party form.
export const clerkAppearance = {
  variables: {
    colorPrimary: "#2563eb",
    borderRadius: "0.75rem",
    fontFamily: "inherit",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none border-0 bg-transparent",
    card: "bg-transparent shadow-none border-0 p-0 w-full",
    header: "text-left",
    headerTitle: "text-2xl font-bold tracking-tight",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButton: "rounded-full border border-border hover:bg-secondary normal-case",
    formButtonPrimary: "rounded-full normal-case font-medium shadow-sm",
    formFieldInput: "rounded-xl",
    footerActionLink: "text-accent hover:text-accent",
  },
};
