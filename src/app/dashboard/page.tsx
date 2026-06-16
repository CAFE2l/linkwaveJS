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

  const [{ data: user }, { data: profile }, { data: links }, { data: clicks }] = await Promise.all([
    supabase.from("users").select("*").eq("id", authUser.id).single(),
    supabase.from("profiles").select("*").eq("user_id", authUser.id).maybeSingle(),
    supabase.from("links").select("*").eq("user_id", authUser.id).order("order_position"),
    supabase.from("clicks").select("link_id, links(title)").eq("user_id", authUser.id),
  ]);

  if (!user) redirect("/register");

  const clickCounts = new Map<string, { title: string; count: number }>();
  clicks?.forEach((click) => {
    const link = Array.isArray(click.links) ? click.links[0] : click.links;
    const title = link?.title ?? "Link";
    const current = clickCounts.get(click.link_id) ?? { title, count: 0 };
    clickCounts.set(click.link_id, { title, count: current.count + 1 });
  });
  const topLink = [...clickCounts.values()].sort((a, b) => b.count - a.count)[0]?.title;

  return (
    <DashboardShell user={user}>
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.35fr]">
        <section className="space-y-6">
          <StatsCards totalLinks={links?.length ?? 0} totalClicks={clicks?.length ?? 0} topLink={topLink} />
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
