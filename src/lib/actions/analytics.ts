"use server";

import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/firebase/auth-server";

export type DailyCount = { date: string; count: number };
export type CountryCount = { country: string; count: number };
export type TopLink = { id: string; title: string; url: string; username: string; clicks: number };
export type HourlyCount = { hour: number; count: number };
export type EngagementItem = { links: number; users: number };

export type AnalyticsData = {
  totalUsers: number;
  totalUsersDelta: number;
  activeUsers: number;
  inactiveUsers: number;
  totalLinks: number;
  totalClicks: number;
  clicksToday: number;
  clicksLast30Days: number;
  totalClicksDelta: number;
  userGrowth: DailyCount[];
  clickActivity: DailyCount[];
  topLinks: TopLink[];
  countryDistribution: CountryCount[];
  hourlyActivity: HourlyCount[];
  engagement: EngagementItem[];
};

async function requireAdmin() {
  const authUser = await getCurrentUser();
  if (!authUser) redirect("/login");

  const user = await getPrisma().user.findFirst({
    where: { id: authUser.uid },
    select: { role: true },
  });

  if (!user || user.role !== "admin") redirect("/dashboard");
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
  await requireAdmin();

  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    activeUsers,
    inactiveUsers,
    totalLinks,
    totalClicks,
    clicksToday,
    recentClicks,
    recentUsers,
    prevPeriodClicks,
    allLinks,
    allUsers,
    allClickData,
  ] = await Promise.all([
    getPrisma().user.count(),
    getPrisma().user.count({ where: { active: true } }),
    getPrisma().user.count({ where: { active: false } }),
    getPrisma().link.count(),
    getPrisma().click.count(),
    getPrisma().click.count({ where: { createdAt: { gte: todayStart } } }),
    getPrisma().click.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    getPrisma().user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    getPrisma().click.count({
      where: {
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
    }),
    getPrisma().link.findMany({
      select: { id: true, title: true, url: true, userId: true },
      take: 200,
    }),
    getPrisma().user.findMany({ select: { id: true, username: true } }),
    getPrisma().click.findMany({ select: { linkId: true, createdAt: true, country: true } }),
  ]);

  const currCount = recentClicks.length;
  const diff = currCount - prevPeriodClicks;
  const totalClicksDelta = prevPeriodClicks > 0 ? Math.round((diff / prevPeriodClicks) * 100) : 0;

  const prevUsers = await getPrisma().user.count({
    where: {
      createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
    },
  });
  const totalUsersDelta = prevUsers
    ? Math.round(((recentUsers.length - prevUsers) / prevUsers) * 100)
    : 0;

  const userGrowth = fillDateGaps(
    Array.from(
      recentUsers.reduce<Map<string, number>>((acc, u) => {
        const key = u.createdAt.toISOString().slice(0, 10);
        acc.set(key, (acc.get(key) ?? 0) + 1);
        return acc;
      }, new Map()),
      ([date, count]) => ({ date, count }),
    ),
    30,
  );

  const clickActivity = fillDateGaps(
    Array.from(
      recentClicks.reduce<Map<string, number>>((acc, c) => {
        const key = c.createdAt.toISOString().slice(0, 10);
        acc.set(key, (acc.get(key) ?? 0) + 1);
        return acc;
      }, new Map()),
      ([date, count]) => ({ date, count }),
    ),
    30,
  );

  const clickCounts = new Map<string, number>();
  for (const c of allClickData) {
    clickCounts.set(c.linkId, (clickCounts.get(c.linkId) ?? 0) + 1);
  }

  const usersMap = new Map(allUsers.map((u) => [u.id, u.username]));

  const sortedLinks = allLinks
    .map((l) => ({
      id: l.id,
      title: l.title,
      url: l.url,
      username: usersMap.get(l.userId) ?? l.userId.slice(0, 8),
      clicks: clickCounts.get(l.id) ?? 0,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  const countryMap = new Map<string, number>();
  for (const c of allClickData) {
    if (c.country) {
      countryMap.set(c.country, (countryMap.get(c.country) ?? 0) + 1);
    }
  }
  const countryArray = Array.from(countryMap.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);

  const hourlyCounts = new Array(24).fill(0);
  for (const c of allClickData) {
    const hour = c.createdAt.getHours();
    hourlyCounts[hour]++;
  }
  const hourlyActivity = hourlyCounts.map((count, hour) => ({ hour, count }));

  const userLinkCounts = new Map<string, number>();
  for (const l of allLinks) {
    userLinkCounts.set(l.userId, (userLinkCounts.get(l.userId) ?? 0) + 1);
  }
  const engagementMap = new Map<number, number>();
  for (const count of userLinkCounts.values()) {
    engagementMap.set(count, (engagementMap.get(count) ?? 0) + 1);
  }
  const engagement = Array.from(engagementMap.entries())
    .map(([links, users]) => ({ links, users }))
    .sort((a, b) => a.links - b.links);

  return {
    totalUsers,
    totalUsersDelta,
    activeUsers,
    inactiveUsers,
    totalLinks,
    totalClicks,
    clicksToday,
    clicksLast30Days: currCount,
    totalClicksDelta,
    userGrowth,
    clickActivity,
    topLinks: sortedLinks,
    countryDistribution: countryArray,
    hourlyActivity,
    engagement,
  };
}
