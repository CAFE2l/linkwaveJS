import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfileCard } from "@/components/dashboard/profile-card";
import { LinksManager } from "@/components/dashboard/links-manager";
import { ThemeCustomizer } from "@/components/dashboard/theme-customizer";
import { createClient } from "@/lib/supabase/server";
import type { Link, UserThemeConfig } from "@/types/database";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  const userResult = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();
  const profileResult = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", authUser.id)
    .maybeSingle();
  const linksResult = (await supabase
    .from("links")
    .select("*")
    .eq("user_id", authUser.id)
    .order("order_position")) as unknown as {
    data: Link[] | null;
  };
  const clickResult = (await supabase
    .from("clicks")
    .select("link_id")
    .eq("user_id", authUser.id)) as unknown as {
    data: { link_id: string }[] | null;
  };

  const user = userResult.data;
  const profile = profileResult.data ?? null;
  const links = linksResult.data ?? [];
  const clickRows = clickResult.data ?? [];

  if (!user) redirect("/register");

  const totalClicks = clickRows.length;
  const totalLinks = links.length;

  const userTheme = (profile?.custom_colors ?? null) as UserThemeConfig | null;

  return (
    <DashboardShell user={user}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <div className="space-y-6">
          <ProfileCard
            user={user}
            profile={profile}
            totalLinks={totalLinks}
            totalClicks={totalClicks}
          />
        </div>
        <LinksManager links={links} />
      </div>

      <div className="mt-10">
        <ThemeCustomizer initial={userTheme} />
      </div>
    </DashboardShell>
  );
}
