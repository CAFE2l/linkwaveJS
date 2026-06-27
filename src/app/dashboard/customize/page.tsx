import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CustomizePanel } from "@/components/customize/customize-panel";

export const metadata = { title: "Customizar | LinkWave" };

export default async function CustomizePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const [userResult, profileResult, linksResult] = await Promise.all([
    supabase.from("users").select("*").eq("id", authUser.id).single(),
    supabase.from("profiles").select("bio").eq("user_id", authUser.id).maybeSingle(),
    supabase
      .from("links")
      .select("*")
      .eq("user_id", authUser.id)
      .order("order_position"),
  ]);

  const user = userResult.data;
  if (!user) redirect("/register");

  return (
    <CustomizePanel
      user={user}
      links={linksResult.data ?? []}
      initialBio={profileResult.data?.bio ?? ""}
    />
  );
}
