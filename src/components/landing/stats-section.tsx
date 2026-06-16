import { Activity, MousePointerClick, SmilePlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MotionReveal } from "@/components/shared/motion-reveal";
import type { LandingStats } from "@/types/database";

const labels = [
  { key: "totalUsers", label: "Usuários ativos", icon: Activity },
  { key: "totalClicks", label: "Cliques registrados", icon: MousePointerClick },
  { key: "satisfaction", label: "Satisfação", icon: SmilePlus, suffix: "%" },
] as const;

export function StatsSection({ stats }: { stats: LandingStats }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-4 md:grid-cols-3">
        {labels.map((item, index) => {
          const Icon = item.icon;
          const value = stats[item.key].toLocaleString("pt-BR");
          return (
            <MotionReveal key={item.key} delay={index * 0.06}>
              <Card className="p-6">
                <Icon className="mb-6 text-brand" size={24} />
                <div className="font-mono text-4xl font-black">
                  {value}
                  {"suffix" in item ? item.suffix : "+"}
                </div>
                <p className="mt-2 font-semibold text-muted">{item.label}</p>
              </Card>
            </MotionReveal>
          );
        })}
      </div>
    </section>
  );
}
