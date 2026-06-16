import { BarChart3, Link2, MousePointerClick } from "lucide-react";
import { Card } from "@/components/ui/card";

export function StatsCards({
  totalLinks,
  totalClicks,
  topLink,
}: {
  totalLinks: number;
  totalClicks: number;
  topLink?: string;
}) {
  const stats = [
    { label: "Links ativos", value: totalLinks, icon: Link2 },
    { label: "Cliques totais", value: totalClicks, icon: MousePointerClick },
    { label: "Top link", value: topLink ?? "Sem dados", icon: BarChart3 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-5">
            <Icon className="text-brand" size={22} />
            <div className="mt-5 font-mono text-3xl font-black">{stat.value}</div>
            <div className="mt-1 text-sm font-semibold text-muted">{stat.label}</div>
          </Card>
        );
      })}
    </div>
  );
}
