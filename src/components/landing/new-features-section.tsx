"use client";

import { BarChart3, Infinity, Palette, Smartphone, Sparkles, Eye } from "lucide-react";
import { MotionReveal } from "@/components/shared/motion-reveal";

const features = [
  { title: "Personalização total", description: "Cores, temas, fontes e estilos. Sua página com sua cara, fluindo do seu jeito.", icon: Palette },
  { title: "Links ilimitados", description: "Adicione quantos links quiser com ícones, descrições e a ordem que preferir.", icon: Infinity },
  { title: "Estatísticas em tempo real", description: "Veja cliques, visitas e engajamento — saiba quem está surfando na sua onda.", icon: BarChart3 },
  { title: "100% responsivo", description: "Perfeito em qualquer dispositivo, do celular ao PC, com a mesma elegância.", icon: Smartphone },
  { title: "Temas premium", description: "Escolha entre temas prontos ou crie o seu com cores e estilos únicos.", icon: Sparkles },
  { title: "Banner personalizado", description: "Destaque sua marca com banner, avatar e bio — tudo ajustável.", icon: Eye },
];

export function NewFeaturesSection() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 md:py-28" id="recursos">
      <MotionReveal className="text-center">
        <span className="glass-tag">Recursos</span>
        <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl text-ocean">
          Tudo que você precisa
        </h2>
        <p className="mt-3 text-base text-muted max-w-md mx-auto">
          Ferramentas completas para criar e compartilhar sua presença digital.
        </p>
      </MotionReveal>

      <div className="mx-auto mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <MotionReveal key={feature.title} delay={index * 0.05}>
              <div className="glass-card p-6 h-full flex flex-col items-start gap-4 group hover:scale-[1.02]">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(210,240,255,0.7))",
                    border: "1.5px solid rgba(255,255,255,0.9)",
                    boxShadow: "0 4px 12px rgba(80,180,220,0.2), inset 0 1px 0 rgba(255,255,255,1)",
                  }}
                >
                  <Icon size={20} style={{ color: "#2a8abf" }} />
                </div>
                <div>
                  <h3 className="font-black text-ocean">{feature.title}</h3>
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
