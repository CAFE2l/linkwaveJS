import { getAnalyticsOverview } from "@/lib/actions/analytics";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";

export const metadata = { title: "Visão geral | Admin" };

export default async function AdminOverviewPage() {
  const data = await getAnalyticsOverview();

  return <AnalyticsDashboard data={data} />;
}
