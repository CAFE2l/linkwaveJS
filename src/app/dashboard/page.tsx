import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LinksManager } from "@/components/dashboard/links-manager";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  const userResult = await supabase.from("users").select("*").eq("id", authUser.id).single();
  const profileResult = await supabase.from("profiles").select("*").eq("user_id", authUser.id).maybeSingle();
  const linksResult = await supabase.from("links").select("*").eq("user_id", authUser.id).order("order_position") as unknown as { data: { id: string; user_id: string; title: string; url: string; icon: string | null; order_position: number; created_at: string }[] | null };
  const clickResult = await supabase.from("clicks").select("link_id").eq("user_id", authUser.id) as unknown as { data: { link_id: string }[] | null };

  const user = userResult.data;
  const profile = profileResult.data ?? null;
  const links = linksResult.data;
  const clickRows = clickResult.data;

  if (!user) redirect("/register");

  const linkMap = new Map(links?.map((l) => [l.id, l.title]) ?? []);
  const clickCounts = new Map<string, { title: string; count: number }>();
  clickRows?.forEach((click) => {
    const title = linkMap.get(click.link_id) ?? "Link";
    const current = clickCounts.get(click.link_id) ?? { title, count: 0 };
    clickCounts.set(click.link_id, { title, count: current.count + 1 });
  });
  const topLink = [...clickCounts.values()].sort((a, b) => b.count - a.count)[0]?.title;

  return (
    <DashboardShell user={user}>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.35fr]">
        <section className="space-y-6">
          <StatsCards
            totalLinks={links?.length ?? 0}
            totalClicks={clickRows?.length ?? 0}
            topLink={topLink}
          />
          <Card className="p-6">
            <h1 className="text-2xl font-black">Perfil</h1>
            <p className="mt-2 text-sm font-medium text-muted">
              Altere avatar, bio, username e tema da página pública.
            </p>
            <div className="mt-6">
              <ProfileForm user={user} profile={profile} />
            </div>
          </Card>
        </section>
        <section>
          <Card className="p-6">
            <h2 className="text-2xl font-black">Links</h2>
            <p className="mt-2 text-sm font-medium text-muted">
              Crie, edite, exclua e arraste para reordenar.
            </p>
            <div className="mt-6">
              <LinksManager links={links ?? []} />
            </div>
          </Card>
        </section>
      </div>
    </DashboardShell>
  );
}
