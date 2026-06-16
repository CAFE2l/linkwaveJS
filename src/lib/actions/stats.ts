import { createClient } from "@/lib/supabase/server";
import type { LandingStats } from "@/types/database";

export async function getLandingStats(): Promise<LandingStats> {
  try {
    const supabase = await createClient();

    const [{ count: totalUsers }, { count: totalClicks }, { data: activeUsers }] =
      await Promise.all([
        supabase
          .from("users")
          .select("id", { count: "exact", head: true })
          .eq("active", true),
        supabase.from("clicks").select("id", { count: "exact", head: true }),
        supabase.from("users").select("id").eq("active", true),
      ]);

    const activeIds = activeUsers?.map((u) => u.id) ?? [];
    let usersWithClicks = 0;

    if (activeIds.length > 0) {
      const { data } = await supabase
        .from("clicks")
        .select("user_id")
        .in("user_id", activeIds);

      usersWithClicks = new Set(data?.map((click) => click.user_id)).size;
    }

    const users = totalUsers ?? 0;

    return {
      totalUsers: users,
      totalClicks: totalClicks ?? 0,
      satisfaction: users > 0 ? Math.round((usersWithClicks / users) * 100) : 99,
    };
  } catch (error) {
    console.error("getLandingStats", error);
    return { totalUsers: 0, totalClicks: 0, satisfaction: 99 };
  }
}
