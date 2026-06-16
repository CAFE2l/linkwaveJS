import { BarChart3, Infinity, Palette, ShieldCheck, Smartphone, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MotionReveal } from "@/components/shared/motion-reveal";

const features = [
  ["Personalização premium", "Temas, avatar, bio e identidade visual para cada perfil.", Palette],
  ["Links ilimitados", "Organização flexível com ordenação por drag-and-drop.", Infinity],
  ["Analytics real", "Cliques por link e histórico para entender sua audiência.", BarChart3],
  ["Mobile first", "Experiência polida em iPhone, Android, tablet e desktop.", Smartphone],
  ["Segurança SaaS", "RLS, validação Zod, middleware e rate limiting básico.", ShieldCheck],
  ["Performance", "Server Components, cache, imagens otimizadas e carregamento enxuto.", Zap],
] as const;

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-24">
      <MotionReveal className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">Recursos</p>
        <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
          Construído como SaaS, não como página estática.
        </h2>
      </MotionReveal>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map(([title, description, Icon], index) => (
          <MotionReveal key={title} delay={index * 0.04}>
            <Card className="h-full p-6 transition hover:-translate-y-1 hover:shadow-2xl">
              <Icon className="text-brand" size={24} />
              <h3 className="mt-6 text-lg font-black">{title}</h3>
              <p className="mt-2 leading-7 text-muted">{description}</p>
            </Card>
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}
