import Image from "next/image";
import { ArrowRight, UserPlus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
        <Card className="glass-strong relative overflow-hidden p-8 text-center shadow-2xl md:p-14">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 rounded-full bg-gradient-to-r from-accent/15 via-brand/10 to-cyan/15 blur-[100px] animate-aurora" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 rounded-full bg-gradient-to-r from-cyan/10 via-accent/10 to-brand/10 blur-[100px] animate-aurora" style={{ animationDelay: "-10s" }} />
          <div className="relative">
            <div className="relative mx-auto inline-block">
              <Image
                src="/brand/icon.png"
                alt="LinkWave"
                width={80}
                height={80}
                className="rounded-3xl shadow-xl ring-2 ring-white/30"
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/40 to-transparent opacity-60" />
            </div>
            <h2 className="mt-7 text-4xl font-black tracking-tight md:text-5xl">
              Vamos surfar juntos?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-muted">
              Mais de{" "}
              <span className="font-black text-foreground">
                {totalUsers.toLocaleString("pt-BR")}
              </span>{" "}
              pessoas já estão na onda. Crie sua página em menos de 2 minutos.
            </p>
            <div className="mt-8">
              <ButtonLink
                href={isLoggedIn ? "/dashboard" : "/register"}
                size="lg"
                variant="accent"
              >
                {isLoggedIn ? <ArrowRight size={19} /> : <UserPlus size={19} />}
                {isLoggedIn
                  ? "Acessar Dashboard"
                  : "Começar agora — grátis"}
              </ButtonLink>
            </div>
          </div>
        </Card>
      </MotionReveal>
    </section>
  );
}
