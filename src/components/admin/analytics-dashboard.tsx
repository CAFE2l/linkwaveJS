"use client";

import { OverviewCards } from "./charts/overview-cards";
import { UserGrowthChart } from "./charts/user-growth-chart";
import { ClickActivityChart } from "./charts/click-activity-chart";
import { TopLinksChart } from "./charts/top-links-chart";
import { CountryChart } from "./charts/country-chart";
import { HourlyActivityChart } from "./charts/hourly-activity-chart";
import { EngagementChart } from "./charts/engagement-chart";
import type { AnalyticsData } from "@/lib/actions/analytics";

export function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-6 admin-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[#0a1626] tracking-tight">Visão geral</h1>
        <p className="mt-1 text-sm text-[rgba(10,22,38,0.6)]">Acompanhe métricas, usuários e atividades da plataforma LinkWave.</p>
      </div>

      <OverviewCards
        totalUsers={data.totalUsers}
        activeUsers={data.activeUsers}
        totalLinks={data.totalLinks}
        totalClicks={data.totalClicks}
        clicksToday={data.clicksToday}
        clicksLast30Days={data.clicksLast30Days}
        totalClicksDelta={data.totalClicksDelta}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <UserGrowthChart data={data.userGrowth} />
        <ClickActivityChart data={data.clickActivity} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <TopLinksChart data={data.topLinks} />
        <CountryChart data={data.countryDistribution} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <HourlyActivityChart data={data.hourlyActivity} />
        <EngagementChart data={data.engagement} />
      </div>
    </div>
  );
}
