import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main className="aurora-shell flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="max-w-lg p-8 text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-sky-500/25">
          <Sparkles className="size-6" />
        </div>
        <h1 className="text-3xl font-black text-slate-950 dark:text-white">Conta criada</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Agora configure seu perfil público, adicione seus primeiros links e publique sua página LinkWave.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href="/dashboard" variant="accent">
            Ir para o dashboard
            <ArrowRight className="size-4" />
          </ButtonLink>
          <Link href="/" className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold text-muted hover:text-foreground">
            Voltar para início
          </Link>
        </div>
      </Card>
    </main>
  );
}
