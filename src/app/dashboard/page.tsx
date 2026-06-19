import { redirect } from "next/navigation";
import FullDashboard from "@/components/customize/FullDashboard";
import { createClient } from "@/lib/supabase/server";
import type { Link } from "@/types/database";

export const metadata = { title: "Dashboard | LinkWave" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const [userResult, linksResult, clickResult] = await Promise.all([
    supabase.from("users").select("*").eq("id", authUser.id).single(),
    supabase.from("links").select("*").eq("user_id", authUser.id).order("order_position") as unknown as Promise<{ data: Link[] | null }>,
    supabase.from("clicks").select("link_id", { count: "exact", head: true }).eq("user_id", authUser.id),
  ]);

  const user = userResult.data;
  const links = linksResult.data ?? [];
  const totalClicks = (clickResult as any).count ?? 0;

  if (!user) redirect("/register");

  return (
    <FullDashboard
      initialUser={user}
      initialLinks={links}
      initialClicks={totalClicks}
    />
  );
}
