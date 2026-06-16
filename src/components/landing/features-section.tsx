import {
  BarChart3,
  Infinity,
  Palette,
  Smartphone,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
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
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/35 px-4 py-1.5 text-sm font-semibold text-brand shadow-sm shadow-brand/10 backdrop-blur-xl">
          Recursos
        </div>
        <h2 className="text-4xl font-black tracking-tight md:text-5xl">
          Tudo que você precisa
        </h2>
      </MotionReveal>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <MotionReveal key={feature.title} delay={index * 0.04} variant="up">
              <Card className="group h-full p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/10">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand shadow-sm backdrop-blur-sm transition duration-300 group-hover:bg-brand/15 group-hover:shadow-md group-hover:shadow-brand/10">
                  <Icon size={21} />
                </div>
                <h3 className="text-lg font-black">{feature.title}</h3>
                <p className="mt-2 leading-7 text-muted">{feature.description}</p>
              </Card>
            </MotionReveal>
          );
        })}
      </div>
    </section>
  );
}
