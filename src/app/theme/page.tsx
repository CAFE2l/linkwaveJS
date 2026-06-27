import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ThemeCustomizer } from "@/components/theme/theme-customizer";
import { getCurrentUser } from "@/lib/firebase/auth-server";
import { prisma } from "@/lib/db/prisma";
import { type UserThemeConfig } from "@/types/database";

export const metadata = { title: "Tema" };

export default async function ThemePage() {
  const authUser = await getCurrentUser();
  if (!authUser) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: authUser.uid } });
  if (!user) redirect("/register");

  const userTheme = (user.themeJson ?? null) as UserThemeConfig | null;

  return (
    <DashboardShell user={user}>
      <ThemeCustomizer initial={userTheme} />
    </DashboardShell>
  );
}
