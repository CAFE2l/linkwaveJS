"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type DailyCount = { date: string; count: number };
export type CountryCount = { country: string; count: number };
export type TopLink = { id: string; title: string; url: string; username: string; clicks: number };
export type HourlyCount = { hour: number; count: number };
export type EngagementItem = { links: number; users: number };

export type AnalyticsData = {
  totalUsers: number;
  totalUsersDelta: number;
  totalLinks: number;
  totalClicks: number;
  totalClicksDelta: number;
  userGrowth: DailyCount[];
  clickActivity: DailyCount[];
  topLinks: TopLink[];
  countryDistribution: CountryCount[];
  hourlyActivity: HourlyCount[];
  engagement: EngagementItem[];
};

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const { data: user } = await supabase
    .from("users")
    .select("role")
    .eq("id", authUser.id)
    .single();

  if (!user || user.role !== "admin") redirect("/dashboard");
  return { supabase, admin: createAdminClient() };
}

function fillDateGaps(data: DailyCount[], days: number): DailyCount[] {
  const map = new Map(data.map((d) => [d.date, d.count]));
  const result: DailyCount[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, count: map.get(key) ?? 0 });
  }
  return result;
}

export async function getAnalyticsOverview(): Promise<AnalyticsData> {
  const { admin } = await requireAdmin();

  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const [
    { count: totalUsers },
    { count: totalLinks },
    { count: totalClicks },
    { data: recentClicks },
    { data: recentUsers },
    { count: prevPeriodClicks },
    { data: allLinks },
    { data: allClickData },
    { data: countryData },
  ] = await Promise.all([
    admin.from("users").select("*", { count: "exact", head: true }),
    admin.from("links").select("*", { count: "exact", head: true }),
    admin.from("clicks").select("*", { count: "exact", head: true }),
    admin
      .from("clicks")
      .select("created_at")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at"),
    admin
      .from("users")
      .select("created_at")
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at"),
    admin
      .from("clicks")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sixtyDaysAgo.toISOString())
      .lt("created_at", thirtyDaysAgo.toISOString()),
    admin.from("links").select("id, title, url, user_id").limit(200),
    admin.from("clicks").select("link_id, created_at, country"),
    admin.from("clicks").select("country"),
  ]);

  const prevCount = prevPeriodClicks ?? 0;
  const currCount = totalClicks ?? 0;
  const diff = currCount - prevCount;
  const totalClicksDelta = prevCount > 0 ? Math.round((diff / prevCount) * 100) : 0;

  const totalUsersDelta = 0;

  const userGrowth = fillDateGaps(
    Array.from(
      (recentUsers ?? []).reduce<Map<string, number>>((acc, u) => {
        const key = u.created_at.slice(0, 10);
        acc.set(key, (acc.get(key) ?? 0) + 1);
        return acc;
      }, new Map()),
      ([date, count]) => ({ date, count }),
    ),
    30,
  );

  const clickActivity = fillDateGaps(
    Array.from(
      (recentClicks ?? []).reduce<Map<string, number>>((acc, c) => {
        const key = c.created_at.slice(0, 10);
        acc.set(key, (acc.get(key) ?? 0) + 1);
        return acc;
      }, new Map()),
      ([date, count]) => ({ date, count }),
    ),
    30,
  );

  const clickCounts = new Map<string, number>();
  for (const c of allClickData ?? []) {
    clickCounts.set(c.link_id, (clickCounts.get(c.link_id) ?? 0) + 1);
  }

  const sortedLinks = (allLinks ?? [])
    .map((l) => ({
      id: l.id,
      title: l.title,
      url: l.url,
      username: l.user_id.slice(0, 8),
      clicks: clickCounts.get(l.id) ?? 0,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  const countryMap = new Map<string, number>();
  for (const c of countryData ?? []) {
    if (c.country) {
      countryMap.set(c.country, (countryMap.get(c.country) ?? 0) + 1);
    }
  }
  const countryArray = Array.from(countryMap.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);

  const hourlyCounts = new Array(24).fill(0);
  for (const c of allClickData ?? []) {
    const hour = new Date(c.created_at).getHours();
    hourlyCounts[hour]++;
  }
  const hourlyActivity = hourlyCounts.map((count, hour) => ({ hour, count }));

  const userLinkCounts = new Map<string, number>();
  for (const l of allLinks ?? []) {
    userLinkCounts.set(l.user_id, (userLinkCounts.get(l.user_id) ?? 0) + 1);
  }
  const engagementMap = new Map<number, number>();
  for (const count of userLinkCounts.values()) {
    engagementMap.set(count, (engagementMap.get(count) ?? 0) + 1);
  }
  const engagement = Array.from(engagementMap.entries())
    .map(([links, users]) => ({ links, users }))
    .sort((a, b) => a.links - b.links);

  return {
    totalUsers: totalUsers ?? 0,
    totalUsersDelta,
    totalLinks: totalLinks ?? 0,
    totalClicks: totalClicks ?? 0,
    totalClicksDelta,
    userGrowth,
    clickActivity,
    topLinks: sortedLinks,
    countryDistribution: countryArray,
    hourlyActivity,
    engagement,
  };
}
