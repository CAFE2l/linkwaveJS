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
    <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-28 md:grid-cols-[1.05fr_0.95fr] md:pb-32 md:pt-36">
      <div className="pointer-events-none absolute left-1/4 top-32 h-72 w-72 rounded-full bg-brand/10 blur-[100px] animate-blob" />
      <div className="pointer-events-none absolute right-1/4 top-64 h-56 w-56 rounded-full bg-accent/10 blur-[80px] animate-blob-2" />

      <MotionReveal>
        <div className="relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/8 px-4 py-1.5 text-sm font-semibold text-brand shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-subtle" />
            LinkWave v1.0 &mdash; Crie sua onda
          </div>
          <h1 className="text-balance text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            Sua onda de<br />
            <span className="text-gradient">links pessoais</span>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted md:text-xl">
            Uma página única e compartilhável com todos os seus links. Simples de
            criar, impossível de ignorar.
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
          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-muted">
            <CheckCircle2 size={17} className="text-accent" />
            Gratuito &middot; Sem cartão de crédito
          </div>
        </div>
      </MotionReveal>

      <MotionReveal delay={0.12} variant="right">
        <div className="relative">
          <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-brand/5 blur-2xl" />
          <div className="glass-panel relative overflow-hidden rounded-[2rem] p-4">
            <div className="absolute inset-x-8 top-4 h-28 rounded-full bg-brand/20 blur-3xl" />
            <div className="relative rounded-[1.5rem] border border-border bg-background/60 p-6 shadow-2xl">
              <div className="flex items-center gap-4">
                <Image
                  src="/brand/icon.png"
                  alt=""
                  width={64}
                  height={64}
                  className="rounded-2xl shadow-lg"
                />
                <div>
                  <p className="text-xs font-semibold text-muted">@linkwave</p>
                  <h2 className="text-xl font-black">Minha onda de links</h2>
                </div>
              </div>
              <div className="mt-6 space-y-2.5">
                {[
                  { label: "Instagram", color: "from-pink-500 to-rose-500" },
                  { label: "YouTube", color: "from-red-500 to-rose-600" },
                  { label: "Portfólio", color: "from-blue-500 to-sky-500" },
                  { label: "Agenda", color: "from-emerald-500 to-teal-500" },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className="group flex items-center justify-between rounded-2xl border border-border bg-white/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-white/5"
                    style={{ transform: `translateX(${index % 2 ? 10 : 0}px)` }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-8 w-8 rounded-xl bg-gradient-to-br ${item.color} shadow-sm`}
                      />
                      <span className="font-bold">{item.label}</span>
                    </div>
                    <ArrowRight size={17} className="text-brand opacity-0 transition group-hover:opacity-100" />
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2.5">
                <Metric label="Usuários" value={`${stats.totalUsers.toLocaleString("pt-BR")}+`} />
                <Metric label="Cliques" value={`${stats.totalClicks.toLocaleString("pt-BR")}+`} />
                <Metric label="Satisfação" value={`${stats.satisfaction}%`} />
              </div>
            </div>
          </div>
        </div>
      </MotionReveal>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white/60 px-2 py-3 text-center shadow-sm dark:bg-white/5">
      <div className="font-mono text-base font-black text-brand md:text-lg">{value}</div>
      <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
        {label}
      </div>
    </div>
  );
}
