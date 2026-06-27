"use client";

import { Quote } from "lucide-react";
import { MotionReveal } from "@/components/shared/motion-reveal";

const testimonials = [
  {
    quote: "Finalmente uma plataforma bonita pra criar minha página de links. O design é impecável e muito fácil de usar.",
    name: "Ana Clara",
    role: "Criadora de conteúdo",
    initials: "AC",
    gradient: "from-pink-400 to-rose-500",
  },
  {
    quote: "Uso no meu perfil do Instagram e os cliques aumentaram muito. Meus seguidores amam a experiência visual.",
    name: "Rafael Lima",
    role: "Fotógrafo",
    initials: "RL",
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    quote: "Já testei várias ferramentas, mas o LinkWave é a única que entrega design premium de verdade. E de graça!",
    name: "Juliana Costa",
    role: "Designer",
    initials: "JC",
    gradient: "from-purple-400 to-indigo-500",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 md:py-28">
      <MotionReveal className="text-center">
        <span className="glass-tag">Depoimentos</span>
        <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl text-ocean">
          Quem já surfou aprova
        </h2>
        <p className="mt-3 text-base text-muted max-w-md mx-auto">
          O que nossos usuários estão dizendo.
        </p>
      </MotionReveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <MotionReveal key={t.name} delay={i * 0.1}>
            <div className="glass-card p-6 flex flex-col h-full group hover:scale-[1.02] transition-transform duration-300">
              <Quote size={24} className="text-cyan-300/60 mb-3 shrink-0" />
              <p className="text-sm leading-relaxed text-muted flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/40">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-xs font-black`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-black text-ocean">{t.name}</p>
                  <p className="text-xs font-semibold text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}
