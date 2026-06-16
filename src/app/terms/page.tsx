import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos de Uso da plataforma LinkWave.",
};

export default function TermsPage() {
  return (
    <main className="aurora-shell relative min-h-screen overflow-hidden px-4 py-6">
      <div className="pointer-events-none absolute left-[-12rem] top-[-8rem] h-[30rem] w-[30rem] rounded-full bg-emerald-300/25 blur-[120px] dark:bg-emerald-500/12 animate-blob" />
      <div className="pointer-events-none absolute right-[-10rem] top-[20rem] h-[35rem] w-[35rem] rounded-full bg-sky-300/30 blur-[120px] dark:bg-sky-500/14 animate-blob-2" style={{ animationDelay: "-4s" }} />

      <div className="relative mx-auto min-h-[calc(100vh-3rem)] w-full max-w-4xl">
        <header className="glass-nav mb-8 flex items-center justify-between rounded-full px-4 py-3 shadow-lg shadow-sky-950/5">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/brand/icon.png"
                alt="LinkWave"
                width={44}
                height={44}
                className="rounded-2xl"
                priority
              />
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent opacity-50" />
            </div>
            <span className="text-lg font-black text-foreground">
              LinkWave
            </span>
          </Link>
          <Link
            href="/register"
            className="relative inline-flex h-10 items-center gap-2 overflow-hidden rounded-full border border-white/20 bg-gradient-to-b from-white/20 to-white/5 px-4 text-sm font-bold text-foreground shadow-lg shadow-black/5 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-white/8 dark:from-white/8 dark:to-white/3"
          >
            <div className="pointer-events-none absolute inset-x-[15%] top-0 h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            Criar conta
            <ArrowRight className="size-4" />
          </Link>
        </header>

        <div className="glass-panel rounded-[2rem] p-8 sm:p-10">
          <Link
            href="/register"
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Voltar ao cadastro
          </Link>

          <h1 className="text-4xl font-black tracking-tight">Termos de Uso</h1>
          <p className="mt-2 text-sm text-muted">Última atualização: junho de 2026</p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-card-foreground">
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

        <footer className="mt-5 rounded-2xl border border-white/20 bg-white/30 p-4 text-center text-xs text-muted shadow-sm backdrop-blur-md dark:bg-white/5">
          LinkWave &copy; {new Date().getFullYear()} &mdash; Todos os direitos
          reservados.
        </footer>
      </div>
    </main>
  );
}
