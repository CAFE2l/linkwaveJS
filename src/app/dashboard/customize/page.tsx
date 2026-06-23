import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FullDashboard from "@/components/customize/FullDashboard";
import { ThemeProvider } from "@/components/landing/theme-provider";
import { BlobBackground } from "@/components/landing/blob-background";
import { listIconsAction } from "@/lib/actions/icons";

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

  const iconsData = await listIconsAction();
  const allIcons = iconsData.map((i) => i.name);

  return (
    <ThemeProvider>
      <div className="min-h-screen landing-bg">
        <BlobBackground />
        <div className="relative z-10">
          <FullDashboard initialUser={user} initialLinks={links ?? []} initialClicks={0} initialIcons={allIcons} />
        </div>
      </div>
    </ThemeProvider>
  );
}
