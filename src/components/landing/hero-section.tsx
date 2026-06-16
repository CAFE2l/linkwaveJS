import type React from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Globe, Link, LogIn, UserPlus, Zap } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { MotionReveal } from "@/components/shared/motion-reveal";
import type { LandingStats } from "@/types/database";
import instagramIcon from "/imgs/icons/links/Instagram.png";
import youtubeIcon from "/imgs/icons/links/Youtube.png";
import tiktokIcon from "/imgs/icons/links/TikTok.png";
import facebookIcon from "/imgs/icons/links/Facebook.png";

const socialLinks = [
  { name: "Instagram", icon: instagramIcon, handle: "@linkwave", url: "instagram.com/linkwave" },
  { name: "YouTube", icon: youtubeIcon, handle: "@linkwave", url: "youtube.com/@linkwave" },
  { name: "TikTok", icon: tiktokIcon, handle: "@linkwave", url: "tiktok.com/@linkwave" },
  { name: "Facebook", icon: facebookIcon, handle: "/linkwave", url: "facebook.com/linkwave" },
] as const;

export function HeroSection({
  isLoggedIn,
  stats: _stats,
}: {
  isLoggedIn: boolean;
  stats: LandingStats;
}) {
  return (
    <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-28 md:grid-cols-[1.05fr_0.95fr] md:pb-32 md:pt-36">
      {/* Decorative luminous blobs */}
      <div className="pointer-events-none absolute left-[5%] top-[15%] h-96 w-96 rounded-full bg-cyan/15 blur-[130px] animate-blob" />
      <div className="pointer-events-none absolute right-[10%] top-[20%] h-80 w-80 rounded-full bg-brand/15 blur-[110px] animate-blob-2" style={{ animationDelay: "-5s" }} />
      <div className="pointer-events-none absolute left-[40%] top-[55%] h-60 w-60 rounded-full bg-accent/10 blur-[90px] animate-blob-3" />
      <div className="pointer-events-none absolute right-[30%] top-[60%] h-40 w-40 rounded-full bg-cyan/10 blur-[70px] animate-blob-2" style={{ animationDelay: "-10s" }} />

      {/* Left column — text */}
      <MotionReveal>
        <div className="relative">
          {/* Premium badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/35 px-4 py-1.5 text-sm font-semibold text-brand shadow-sm shadow-brand/10 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-accent shadow-sm shadow-accent/50 animate-glow-pulse" />
            LinkWave v1.0 &mdash; Crie sua onda
          </div>

          {/* Title with gradient glow */}
          <h1 className="text-balance text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
            Sua onda de<br />
            <span className="text-gradient">links pessoais</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted md:text-xl">
            Uma página única e compartilhável com todos os seus links. Simples de
            criar, impossível de ignorar.
          </p>

          {/* Buttons */}
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

          {/* Trust indicator */}
          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-muted">
            <CheckCircle2 size={17} className="text-accent" />
            Gratuito &middot; Sem cartão de crédito
          </div>
        </div>
      </MotionReveal>

      {/* Right column — profile mockup */}
      <MotionReveal delay={0.12} variant="right">
        <div className="relative animate-float">
          {/* Outer glow */}
          <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-brand/10 via-cyan/10 to-accent/5 blur-[80px] animate-glow-pulse" />

          {/* Profile card */}
          <div className="glass-panel relative overflow-hidden rounded-[2.5rem] p-1 shadow-2xl shadow-brand/10">
            <div className="absolute inset-x-0 top-0 h-40 rounded-full bg-gradient-to-r from-cyan/20 via-brand/15 to-accent/10 blur-[80px] animate-aurora" />

            <div className="relative rounded-[2.25rem] border border-white/25 bg-white/30 p-6 backdrop-blur-sm md:p-7">
              <div className="absolute inset-0 rounded-[2.25rem] bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

              {/* Profile header */}
              <div className="relative flex items-center gap-4">
                <div className="relative shrink-0">
                  <Image
                    src="/brand/icon.png"
                    alt=""
                    width={56}
                    height={56}
                    className="rounded-2xl shadow-lg ring-2 ring-white/40"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 to-transparent opacity-60" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-wide text-muted">@linkwave</p>
                  <h2 className="truncate text-xl font-black">Minha onda de links</h2>
                  <p className="truncate text-sm text-muted">
                    Compartilhe sua onda de links pessoais 🌊
                  </p>
                </div>
              </div>

              {/* Social link cards */}
              <div className="relative mt-5 space-y-2.5">
                {socialLinks.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/20 bg-white/30 p-3 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg hover:shadow-brand/10 md:p-4"
                  >
                    {/* Hover shine */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    {/* Hover glow */}
                    <div className="pointer-events-none absolute -inset-4 rounded-full bg-brand/5 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

                    <Image
                      src={item.icon}
                      alt=""
                      className="relative z-10 h-8 w-8 shrink-0 rounded-xl object-contain"
                    />
                    <div className="relative z-10 min-w-0 flex-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="truncate text-sm font-bold">{item.name}</span>
                        <span className="hidden truncate text-xs text-muted sm:inline">
                          {item.handle}
                        </span>
                      </div>
                      <p className="truncate text-xs text-muted/80">{item.url}</p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="relative z-10 shrink-0 text-brand opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </div>
                ))}
              </div>

              {/* Follow button */}
              <div className="relative mt-5">
                <div className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-brand to-brand-strong text-sm font-bold text-white shadow-lg shadow-brand/25 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand/30">
                  Seguir
                </div>
              </div>

              {/* Benefits row */}
              <div className="relative mt-5 grid grid-cols-3 gap-2.5">
                <Benefit icon={Globe} title="Página Pública" description="Compartilhe seu perfil com um único link." />
                <Benefit icon={Link} title="Links Ilimitados" description="Adicione quantos links precisar." />
                <Benefit icon={Zap} title="Setup Rápido" description="Crie seu perfil em poucos minutos." />
              </div>
            </div>
          </div>
        </div>
      </MotionReveal>
    </section>
  );
}

function Benefit({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative flex flex-col items-center gap-1.5 overflow-hidden rounded-2xl border border-white/25 bg-white/25 px-2 py-4 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/5">
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <Icon className="relative size-5 text-brand" />
      <div className="relative font-black text-xs leading-tight text-card-foreground md:text-sm">
        {title}
      </div>
      <div className="relative text-[10px] leading-tight text-muted md:text-xs">
        {description}
      </div>
    </div>
  );
}
