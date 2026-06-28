import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import { clerkAppearance } from "@/utils/clerkAppearance";

export default async function Page() {
  // If the user is already signed in, send them to the dashboard
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <AuthShell>
      <SignIn appearance={clerkAppearance} />
    </AuthShell>
  );
}
