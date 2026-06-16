import {
  BarChart3,
  Infinity,
  Palette,
  Smartphone,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { MotionReveal } from "@/components/shared/motion-reveal";

const features = [
  {
    title: "Personalização total",
    description: "Cores, temas e estilos. Sua página com sua cara, fluindo do seu jeito.",
    icon: Palette,
  },
  {
    title: "Links ilimitados",
    description: "Adicione quantos links quiser e organize com ordenação drag-and-drop.",
    icon: Infinity,
  },
  {
    title: "Estatísticas em tempo real",
    description: "Veja quantas pessoas estão surfando na sua onda com analytics real.",
    icon: BarChart3,
  },
  {
    title: "100% responsivo",
    description: "Perfeito em qualquer dispositivo, do celular ao PC.",
    icon: Smartphone,
  },
  {
    title: "Segurança de verdade",
    description: "RLS, validação Zod, rate limiting e proteção contra spam.",
    icon: ShieldCheck,
  },
  {
    title: "Performance nativa",
    description: "Server Components, cache e carregamento instantâneo.",
    icon: Zap,
  },
];

export function FeaturesSection() {
  return (
    <section id="recursos" className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <MotionReveal className="max-w-2xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/30 px-4 py-1.5 text-sm font-semibold text-brand shadow-sm backdrop-blur-xl dark:border-[rgba(0,180,255,0.1)] dark:bg-[rgba(0,180,255,0.06)]">
          Recursos
        </div>
        <h2 className="text-4xl font-black tracking-tight md:text-5xl dark:text-[#d6eaff]">
          Tudo que você precisa
        </h2>
      </MotionReveal>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <MotionReveal key={feature.title} delay={index * 0.04} variant="up">
              <div className="aero-card group h-full p-6 cursor-default">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl text-brand backdrop-blur-sm transition duration-300 dark:bg-[rgba(0,200,255,0.06)] dark:text-[#00c8ff]" style={{ background: "rgba(42,168,224,0.1)" }}>
                  <Icon size={21} />
                </div>
                <h3 className="text-lg font-black dark:text-[#d6eaff]">{feature.title}</h3>
                <p className="mt-2 leading-7 text-muted">{feature.description}</p>
              </div>
            </MotionReveal>
          );
        })}
      </div>
    </section>
  );
}
