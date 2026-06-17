import { BarChart3, Infinity, Palette, Smartphone } from "lucide-react";
import { MotionReveal } from "@/components/shared/motion-reveal";

const features = [
  { title: "Personalização total", description: "Cores, temas e estilos. Sua página com sua cara, fluindo do seu jeito.", icon: Palette },
  { title: "Links ilimitados", description: "Adicione quantos links quiser e organize com ícones.", icon: Infinity },
  { title: "Estatísticas em tempo real", description: "Veja quantas pessoas estão surfando na sua onda.", icon: BarChart3 },
  { title: "100% responsivo", description: "Perfeito em qualquer dispositivo, do celular ao PC.", icon: Smartphone },
];

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-20 md:py-28">
      <MotionReveal className="text-center">
        <span className="glass-tag">Recursos</span>
        <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl text-ocean" style={{ textShadow: "0 2px 0 rgba(255,255,255,0.5)" }}>
          Tudo que você precisa
        </h2>
      </MotionReveal>
      <div className="mx-auto mt-12 grid gap-5 md:grid-cols-2">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <MotionReveal key={feature.title} delay={index * 0.06}>
              <div className="glass-card flex items-start gap-5 p-6">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px]"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(210,240,255,0.7))",
                    border: "1.5px solid rgba(255,255,255,0.9)",
                    boxShadow: "0 4px 12px rgba(80,180,220,0.2), inset 0 1px 0 rgba(255,255,255,1)",
                  }}
                >
                  <Icon size={22} style={{ color: "#2a8abf" }} />
                </div>
                <div>
                  <h3 className="font-bold text-ocean">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{feature.description}</p>
                </div>
              </div>
            </MotionReveal>
          );
        })}
      </div>
    </section>
  );
}
