import { ArrowRight, UserPlus } from "lucide-react";
import { MotionReveal } from "@/components/shared/motion-reveal";
import Image from "next/image";

export function CTASection({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  return (
    <section className="mx-auto max-w-2xl px-5 py-24">
      <MotionReveal variant="scale">
        <div className="glass-card-strong p-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="animate-logo-float">
              <Image
                src="/brand/icon.png"
                alt="LinkWave"
                width={72}
                height={72}
                className="h-20 w-20 md:h-22 md:w-22"
                style={{ filter: "drop-shadow(0 8px 24px rgba(80,200,240,0.5)) drop-shadow(0 2px 8px rgba(255,255,255,0.6))" }}
              />
            </div>
          </div>
          <h2 className="text-3xl font-black tracking-tight md:text-4xl text-ocean" style={{ textShadow: "0 2px 0 rgba(255,255,255,0.5)" }}>
            Vamos surfar juntos?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted" id="cta-sub">
            Crie sua página em menos de 2 minutos.
          </p>
          <div className="mt-8 flex justify-center">
            {isLoggedIn ? (
              <a href="/dashboard" className="glass-button-green px-8 py-3">
                <ArrowRight size={19} /> Acessar Dashboard
              </a>
            ) : (
              <a href="/register" className="glass-button-green px-8 py-3">
                <UserPlus size={19} /> Começar agora &mdash; grátis
              </a>
            )}
          </div>
        </div>
      </MotionReveal>
    </section>
  );
}
