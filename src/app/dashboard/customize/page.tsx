import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FullDashboard from "@/components/customize/FullDashboard";

export const metadata = { title: "Customizar | LinkWave" };

export default async function CustomizePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (!user) redirect("/register");

  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", authUser.id)
    .order("order_position");

  return (
    <FullDashboard initialUser={user} initialLinks={links ?? []} initialClicks={0} />
  );
}
