import Image from "next/image";
import { ArrowRight, CheckCircle2, LogIn, UserPlus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { MotionReveal } from "@/components/shared/motion-reveal";
import type { LandingStats } from "@/types/database";

export function HeroSection({
  isLoggedIn,
  stats,
}: {
  isLoggedIn: boolean;
  stats: LandingStats;
}) {
  return (
    <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 md:grid-cols-[1.08fr_0.92fr] md:pb-28 md:pt-24">
      <MotionReveal>
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-semibold text-muted shadow-sm backdrop-blur-xl dark:bg-white/5">
            <span className="h-2 w-2 rounded-full bg-accent" />
            LinkWave v1.0 - crie sua onda
          </div>
          <h1 className="text-balance text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            Uma presença digital que concentra todos os seus links.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted md:text-xl">
            Publique uma página rápida, bonita e mensurável para Instagram, YouTube,
            portfólio, loja, agenda e tudo que move sua audiência.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            {isLoggedIn ? (
              <ButtonLink href="/dashboard" size="lg" variant="accent">
                Acessar dashboard <ArrowRight size={19} />
              </ButtonLink>
            ) : (
              <>
                <ButtonLink href="/register" size="lg" variant="accent">
                  <UserPlus size={19} /> Pegar minha onda
                </ButtonLink>
                <ButtonLink href="/login" size="lg" variant="ghost">
                  <LogIn size={19} /> Já tenho conta
                </ButtonLink>
              </>
            )}
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm font-medium text-muted">
            <CheckCircle2 size={17} className="text-accent" />
            Gratuito para começar. Sem cartão de crédito.
          </div>
        </div>
      </MotionReveal>

      <MotionReveal delay={0.12}>
        <div className="glass-panel relative overflow-hidden rounded-[2rem] p-4">
          <div className="absolute inset-x-12 top-6 h-24 rounded-full bg-brand/30 blur-3xl" />
          <div className="relative rounded-[1.5rem] border border-border bg-background/70 p-6">
            <div className="flex items-center gap-4">
              <Image src="/brand/icon.png" alt="" width={72} height={72} className="rounded-3xl" />
              <div>
                <p className="text-sm font-semibold text-muted">@linkwave</p>
                <h2 className="text-2xl font-black">Minha onda de links</h2>
              </div>
            </div>
            <div className="mt-8 space-y-3">
              {["Portfolio", "Agenda", "Loja", "YouTube"].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-2xl border border-border bg-white/70 p-4 shadow-sm dark:bg-white/5"
                  style={{ transform: `translateX(${index % 2 ? 12 : 0}px)` }}
                >
                  <span className="font-semibold">{item}</span>
                  <ArrowRight size={18} className="text-brand" />
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <Metric label="Usuários" value={`${stats.totalUsers}+`} />
              <Metric label="Cliques" value={`${stats.totalClicks}+`} />
              <Metric label="Satisfação" value={`${stats.satisfaction}%`} />
            </div>
          </div>
        </div>
      </MotionReveal>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white/55 px-3 py-4 dark:bg-white/5">
      <div className="font-mono text-lg font-black text-brand">{value}</div>
      <div className="mt-1 text-xs font-semibold text-muted">{label}</div>
    </div>
  );
}
