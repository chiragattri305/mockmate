import { SignUp } from "@clerk/nextjs";
import AuthShell from "@/components/AuthShell";
import { clerkAppearance } from "@/utils/clerkAppearance";

export default function Page() {
  return (
    <AuthShell>
      <SignUp appearance={clerkAppearance} />
    </AuthShell>
  );
}
