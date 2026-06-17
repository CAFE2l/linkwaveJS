import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ThemeCustomizer } from "@/components/theme/theme-customizer";
import { createClient } from "@/lib/supabase/server";
import { type UserThemeConfig } from "@/types/database";

export const metadata = { title: "Tema" };

export default async function ThemePage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (!user) redirect("/register");

  const userTheme = (user.theme_json ?? null) as UserThemeConfig | null;

  return (
    <DashboardShell user={user}>
      <ThemeCustomizer initial={userTheme} />
    </DashboardShell>
  );
}
