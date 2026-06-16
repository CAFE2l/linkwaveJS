import { AtSign, Link2, UserRoundPlus } from "lucide-react";
import { MotionReveal } from "@/components/shared/motion-reveal";

const steps = [
  {
    number: "01",
    title: "Crie sua conta",
    description: "Cadastre-se com email e senha em segundos. Suporte a Google OAuth incluso.",
    icon: UserRoundPlus,
  },
  {
    number: "02",
    title: "Escolha seu username",
    description: "Garanta um endereço curto, memorável e público em /u/seunome.",
    icon: AtSign,
  },
  {
    number: "03",
    title: "Adicione seus links",
    description: "Instagram, YouTube, site, portfólio — tudo em um lugar só.",
    icon: Link2,
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <MotionReveal className="mx-auto max-w-2xl text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-brand backdrop-blur-xl dark:bg-[rgba(0,180,255,0.08)] dark:border-[rgba(0,180,255,0.2)]" style={{ background: "rgba(255,255,255,0.35)", border: "1.5px solid rgba(255,255,255,0.7)", boxShadow: "0 4px 14px rgba(42,168,224,0.15), inset 0 1px 0 rgba(255,255,255,0.8)" }}>
          Como funciona
        </div>
        <h2 className="text-4xl font-black tracking-tight md:text-5xl dark:text-[#d6eaff]">
          3 passos para surfar
        </h2>
      </MotionReveal>
      <div className="relative mt-14 grid gap-6 md:grid-cols-3">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent md:block" />
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <MotionReveal key={step.title} delay={index * 0.1}>
              <div className="aero-card group relative h-full p-7 cursor-default">
                <div className="mb-5 flex items-center gap-4">
                  <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl text-white shadow-lg dark:from-[#0088cc] dark:to-[#006699]" style={{ background: "linear-gradient(180deg, #2aa8e0 0%, #1a8fc0 100%)", boxShadow: "0 4px 14px rgba(42,168,224,0.4)" }}>
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 to-transparent" />
                    <Icon size={22} className="relative" />
                  </div>
                  <span className="font-mono text-sm font-black tracking-wider dark:text-[#6090b0]" style={{ color: "#4f6d8a" }}>
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-black dark:text-[#d6eaff]">{step.title}</h3>
                <p className="mt-3 leading-7 dark:text-[#6090b0]" style={{ color: "#4f6d8a" }}>{step.description}</p>
              </div>
            </MotionReveal>
          );
        })}
      </div>
    </section>
  );
}
