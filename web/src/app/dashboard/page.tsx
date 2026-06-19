import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabaseServer";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .maybeSingle();
  if (!user) redirect("/login");

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", session.user.id)
    .order("ordem", { ascending: true });

  return <DashboardClient user={user} links={links ?? []} />;
}
