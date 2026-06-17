import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import DashboardConverted from "@/components/dashboard/dashboard-converted";
import { LinksManager } from "@/components/dashboard/links-manager";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { createClient } from "@/lib/supabase/server";
import type { Link } from "@/types/database";

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
  const links = linksResult.data ?? [];
  const clickRows = clickResult.data ?? [];

  if (!user) redirect("/register");

  const totalClicks = clickRows.length;
  const totalLinks = links.length;
  const topLink = links.length > 0
    ? links.reduce((a, b) => a.title.length > b.title.length ? a : b).title
    : undefined;

  return (
    <DashboardShell user={user}>
      <DashboardConverted user={user} links={links} totalClicks={totalClicks} />
    </DashboardShell>
  );
}
