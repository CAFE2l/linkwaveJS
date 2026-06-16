import { Activity, MousePointerClick, SmilePlus } from "lucide-react";
import { MotionReveal } from "@/components/shared/motion-reveal";
import { CountUp } from "./count-up";
import type { LandingStats } from "@/types/database";

const labels = [
  { key: "totalUsers" as const, label: "Usuários ativos", icon: Activity, suffix: "+" },
  { key: "totalClicks" as const, label: "Cliques registrados", icon: MousePointerClick, suffix: "+" },
  { key: "satisfaction" as const, label: "Satisfação", icon: SmilePlus, suffix: "%" },
] as const;

export function StatsSection({ stats }: { stats: LandingStats }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <div className="grid gap-5 md:grid-cols-3">
        {labels.map((item, index) => {
          const Icon = item.icon;
          return (
            <MotionReveal key={item.key} delay={index * 0.08}>
              <div className="aero-card group p-6 cursor-default">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl text-brand backdrop-blur-sm transition duration-300 dark:text-[#00c8ff]" style={{ background: "rgba(42,168,224,0.1)" }}>
                  <Icon size={23} />
                </div>
                <div className="font-mono text-4xl font-black tracking-tight md:text-5xl dark:text-[#d6eaff]">
                  <CountUp end={stats[item.key]} suffix={item.suffix} delay={index * 0.1} />
                </div>
                <p className="mt-2 font-semibold text-muted">{item.label}</p>
              </div>
            </MotionReveal>
          );
        })}
      </div>
    </section>
  );
}
