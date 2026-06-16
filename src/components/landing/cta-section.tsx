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
    <section className="mx-auto max-w-5xl px-4 py-24">
      <MotionReveal>
        <Card className="relative overflow-hidden p-8 text-center md:p-14">
          <div className="absolute inset-x-20 top-0 h-32 rounded-full bg-accent/20 blur-3xl" />
          <Image src="/brand/icon.png" alt="" width={76} height={76} className="relative mx-auto rounded-3xl" />
          <h2 className="relative mt-7 text-4xl font-black tracking-tight md:text-5xl">
            Vamos surfar juntos?
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted">
            {totalUsers.toLocaleString("pt-BR")} pessoas já estão na onda. Publique sua
            página em menos de dois minutos.
          </p>
          <div className="relative mt-8">
            <ButtonLink href={isLoggedIn ? "/dashboard" : "/register"} size="lg" variant="accent">
              {isLoggedIn ? <ArrowRight size={19} /> : <UserPlus size={19} />}
              {isLoggedIn ? "Acessar dashboard" : "Começar agora - grátis"}
            </ButtonLink>
          </div>
        </Card>
      </MotionReveal>
    </section>
  );
}
