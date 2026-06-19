import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PublicPageLayout } from "@/components/shared/public-page-layout";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de Uso da plataforma LinkWave.",
};

export default function TermsPage() {
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

          <h1 className="text-4xl font-black tracking-tight text-foreground">Termos de Uso</h1>
          <p className="mt-2 text-sm text-fg-secondary">Última atualização: junho de 2026</p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-foreground">
            <section className="space-y-2">
              <h2 className="text-lg font-bold">1. Aceitação dos Termos</h2>
              <p>
                Ao criar uma conta no LinkWave, você declara ter lido, entendido e
                concordado com estes Termos de Uso. Caso não concorde com qualquer
                disposição, não utilize a plataforma.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold">2. Definições</h2>
              <p>
                &ldquo;Plataforma&rdquo; refere-se ao site e serviço LinkWave.
                &ldquo;Usuário&rdquo; refere-se a qualquer pessoa que crie uma conta
                ou utilize os serviços oferecidos. &ldquo;Conteúdo&rdquo; refere-se
                a qualquer informação, texto, link, imagem ou material publicado
                pelo usuário na plataforma.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold">3. Cadastro e Conta</h2>
              <p>
                Para utilizar o LinkWave, é necessário criar uma conta fornecendo
                dados verdadeiros e atualizados. O usuário é o único responsável
                pela segurança de sua senha e por todas as atividades realizadas em
                sua conta. O LinkWave se reserva o direito de recusar ou cancelar
                cadastros a seu critério.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold">4. Uso Permitido</h2>
              <p>
                O usuário concorda em utilizar a plataforma apenas para fins
                lícitos e de acordo com estes Termos. É proibido publicar links
                para conteúdo ilegal, difamatório, obsceno, violador de direitos
                autorais ou que de qualquer forma infrinja a legislação brasileira.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold">5. Conteúdo do Usuário</h2>
              <p>
                O usuário mantém todos os direitos sobre o conteúdo que publica. Ao
                publicar, concede ao LinkWave uma licença não exclusiva, gratuita e
                mundial para exibir e distribuir tal conteúdo na plataforma. O
                LinkWave não se responsabiliza pelo conteúdo publicado por
                terceiros.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold">6. Privacidade</h2>
              <p>
                O tratamento de dados pessoais segue os termos da Lei Geral de
                Proteção de Dados (LGPD – Lei nº 13.709/2018). Coletamos apenas os
                dados necessários para o funcionamento do serviço, como nome,
                e-mail e endereço IP. Os dados não são compartilhados com terceiros
                sem seu consentimento, exceto por obrigação legal.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold">7. Analytics</h2>
              <p>
                O LinkWave coleta dados anônimos de cliques (IP, país, cidade,
                data) para fornecer métricas aos usuários sobre seus links. Esses
                dados são agregados e não permitem identificação pessoal direta.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold">8. Limitação de Responsabilidade</h2>
              <p>
                O LinkWave é fornecido &ldquo;como está&rdquo;, sem garantias de
                disponibilidade contínua ou livre de erros. Não nos
                responsabilizamos por danos diretos ou indiretos decorrentes do uso
                ou da impossibilidade de uso da plataforma.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold">9. Suspensão e Cancelamento</h2>
              <p>
                O LinkWave pode suspender ou encerrar contas que violem estes
                Termos, sem aviso prévio. O usuário pode excluir sua conta a
                qualquer momento pelo painel de controle.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold">10. Alterações nos Termos</h2>
              <p>
                Estes Termos podem ser atualizados periodicamente. Notificaremos os
                usuários sobre mudanças relevantes por e-mail ou aviso na
                plataforma. O uso continuado após a alteração constitui aceitação
                dos novos Termos.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold">11. Contato</h2>
              <p>
                Dúvidas ou solicitações relacionadas a estes Termos podem ser
                enviadas para o e-mail de suporte do LinkWave.
              </p>
            </section>
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}
