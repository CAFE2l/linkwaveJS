import { AtSign, Link2, UserRoundPlus } from "lucide-react";
import { MotionReveal } from "@/components/shared/motion-reveal";

const steps = [
  { number: "1", title: "Crie sua conta", description: "Cadastre-se com email e senha em segundos.", icon: UserRoundPlus },
  { number: "2", title: "Escolha seu username", description: "Um link único e memorável só seu.", icon: AtSign },
  { number: "3", title: "Adicione seus links", description: "Instagram, YouTube, site — tudo em um lugar.", icon: Link2 },
];

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-20 md:py-28">
      <MotionReveal className="text-center">
        <span className="glass-tag">Como funciona</span>
        <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl text-ocean" style={{ textShadow: "0 2px 0 rgba(255,255,255,0.5)" }}>
          3 passos para surfar
        </h2>
      </MotionReveal>
      <div className="mx-auto mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <MotionReveal key={step.title} delay={index * 0.1}>
              <div className="glass-card p-7 text-center">
                <div
                  className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full text-sm font-black text-white"
                  style={{
                    background: "linear-gradient(180deg, #5bc8f5, #2aa8e0)",
                    border: "2px solid rgba(255,255,255,0.7)",
                    boxShadow: "0 4px 12px rgba(42,168,224,0.4), inset 0 1px 0 rgba(255,255,255,0.6)",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                  }}
                >
                  {step.number}
                </div>
                <div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[18px]"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(210,240,255,0.7))",
                    border: "1.5px solid rgba(255,255,255,0.9)",
                    boxShadow: "0 4px 12px rgba(80,180,220,0.2), inset 0 1px 0 rgba(255,255,255,1)",
                  }}
                >
                  <Icon size={22} style={{ color: "#2a8abf" }} />
                </div>
                <h3 className="text-lg font-bold text-ocean">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </div>
            </MotionReveal>
          );
        })}
      </div>
    </section>
  );
}
