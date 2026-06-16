import Image from "next/image";
import { ArrowRight, UserPlus } from "lucide-react";
import { MotionReveal } from "@/components/shared/motion-reveal";

export function CTASection({
  isLoggedIn,
  totalUsers,
}: {
  isLoggedIn: boolean;
  totalUsers: number;
}) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 md:py-28">
      <MotionReveal variant="scale">
        <div className="aero-card relative overflow-hidden p-8 text-center shadow-2xl md:p-14">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 rounded-full bg-gradient-to-r from-accent/15 via-brand/10 to-cyan/15 blur-[100px] dark:from-[rgba(0,255,136,0.06)] dark:via-[rgba(0,180,255,0.04)] dark:to-[rgba(0,229,255,0.03)] animate-aurora" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 rounded-full bg-gradient-to-r from-cyan/10 via-accent/10 to-brand/10 blur-[100px] animate-aurora dark:from-[rgba(0,229,255,0.03)] dark:via-[rgba(0,255,136,0.03)] dark:to-[rgba(0,180,255,0.03)]" style={{ animationDelay: "-10s" }} />
          <div className="relative">
            <div className="relative mx-auto inline-block" style={{ animation: "floatLogo 4s ease-in-out infinite" }}>
              <Image
                src="/brand/icon.png"
                alt="LinkWave"
                width={80}
                height={80}
                className="rounded-3xl shadow-lg"
                style={{ border: "2px solid rgba(255,255,255,0.4)" }}
              />
            </div>
            <h2 className="mt-7 text-4xl font-black tracking-tight md:text-5xl dark:text-[#d6eaff]">
              Vamos surfar juntos?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-muted">
              Mais de{" "}
              <span className="font-black dark:text-[#d6eaff]">
                {totalUsers.toLocaleString("pt-BR")}
              </span>{" "}
              pessoas já estão na onda. Crie sua página em menos de 2 minutos.
            </p>
            <div className="mt-8 flex justify-center">
              {isLoggedIn ? (
                <a href="/dashboard" className="aero-btn-blue text-base px-7 py-3 no-underline">
                  <ArrowRight size={19} /> Acessar Dashboard
                </a>
              ) : (
                <a href="/register" className="aero-btn-green text-base px-7 py-3 no-underline">
                  <UserPlus size={19} /> Começar agora &mdash; grátis
                </a>
              )}
            </div>
          </div>
        </div>
      </MotionReveal>
    </section>
  );
}
