import { AtSign, Link2, UserRoundPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MotionReveal } from "@/components/shared/motion-reveal";

const steps = [
  {
    title: "Crie sua conta",
    description: "Entre com Supabase Auth, sessão persistente e proteção automática.",
    icon: UserRoundPlus,
  },
  {
    title: "Escolha seu username",
    description: "Garanta um endereço curto, memorável e público em /u/seunome.",
    icon: AtSign,
  },
  {
    title: "Organize seus links",
    description: "Crie, edite, exclua e reordene seus links em segundos.",
    icon: Link2,
  },
];

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <MotionReveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">Como funciona</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
          Três passos para publicar sua página.
        </h2>
      </MotionReveal>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <MotionReveal key={step.title} delay={index * 0.08}>
              <Card className="h-full p-7">
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-sky-500/20">
                  <Icon size={22} />
                </div>
                <div className="font-mono text-sm font-black text-muted">0{index + 1}</div>
                <h3 className="mt-3 text-xl font-black">{step.title}</h3>
                <p className="mt-3 leading-7 text-muted">{step.description}</p>
              </Card>
            </MotionReveal>
          );
        })}
      </div>
    </section>
  );
}
