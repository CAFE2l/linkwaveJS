import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfileEditor } from "@/components/profile/profile-editor";
import { createClient } from "@/lib/supabase/server";
import { ThemeProvider } from "@/components/landing/theme-provider";
import { BlobBackground } from "@/components/landing/blob-background";

export const metadata = { title: "Perfil" };

export default async function ProfilePage() {
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

  const { data: profile } = await supabase
    .from("profiles")
    .select("bio")
    .eq("user_id", authUser.id)
    .maybeSingle();

  return (
    <ThemeProvider>
      <div className="min-h-screen landing-bg">
        <BlobBackground />
        <div className="relative z-10">
          <DashboardShell user={user}>
            <div className="mx-auto max-w-5xl px-5">
              <div className="glass-divider" />
            </div>
            <ProfileEditor user={user} initialBio={profile?.bio ?? ""} />
          </DashboardShell>
        </div>
      </div>
    </ThemeProvider>
  );
}
