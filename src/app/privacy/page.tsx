import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PublicPageLayout } from "@/components/shared/public-page-layout";

export const metadata: Metadata = {
  title: "Privacidade",
  description: "Política de privacidade da plataforma LinkWave.",
};

export default function PrivacyPage() {
  return (
    <PublicPageLayout isLoggedIn={false}>
      <div className="page-container pb-8 pt-24">
        <div className="card p-8 sm:p-10">
          <Link
            href="/register"
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-fg-secondary transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Voltar ao cadastro
          </Link>

          <h1 className="text-4xl font-black tracking-tight text-foreground">Privacidade</h1>
          <p className="mt-2 text-sm text-fg-secondary">Última atualização: junho de 2026</p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-foreground">
            <section className="space-y-2">
              <h2 className="text-lg font-bold">1. Dados coletados</h2>
              <p>
                Coletamos apenas os dados necessários para criar e manter sua conta,
                como nome, e-mail, username, avatar, banner, links publicados e
                configurações de personalização.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold">2. Uso dos dados</h2>
              <p>
                Utilizamos seus dados para autenticação, publicação da página,
                personalização visual, segurança da conta e funcionamento das
                estatísticas do painel.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold">3. Analytics</h2>
              <p>
                Registramos eventos de clique em links para exibir métricas ao
                dono da página. Esses dados são usados para relatórios internos da
                conta e melhoria do serviço.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold">4. Compartilhamento</h2>
              <p>
                Não vendemos dados pessoais. Informações podem ser compartilhadas
                apenas com provedores necessários ao funcionamento da plataforma ou
                quando houver obrigação legal.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold">5. Seus direitos</h2>
              <p>
                Você pode solicitar correção, exportação ou exclusão dos seus dados,
                conforme a Lei Geral de Proteção de Dados (LGPD).
              </p>
            </section>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}
