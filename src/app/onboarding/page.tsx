import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/firebase/auth-server";

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (user) redirect("/dashboard");
  redirect("/register");
}
