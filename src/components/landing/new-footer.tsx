import Image from "next/image";
import Link from "next/link";

export function NewFooter() {
  return (
    <footer className="px-5 pb-8 pt-4">
      <div className="mx-auto max-w-6xl">
        <div className="glass-card-strong rounded-3xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-3">
                <Image src="/brand/icon.png" alt="LinkWave" width={28} height={28} className="h-7 w-7" />
                <span className="text-lg font-black text-ocean">LinkWave</span>
              </div>
              <p className="text-sm leading-relaxed text-muted">
                Centralize todos os seus links em uma página bonita e compartilhável. Minimalista, elegante, em segundos.
              </p>
              <div className="mt-5">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-white bg-gradient-to-b from-cyan-400 to-blue-500 border border-white/50 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Criar página grátis
                  <span className="text-white/70 text-xs">→</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
              <div>
                <h4 className="text-xs font-black text-ocean uppercase tracking-widest mb-4">Produto</h4>
                <ul className="space-y-2.5">
                  <li><Link href="#features" className="text-sm text-muted hover:text-ocean transition-colors font-semibold">Funcionalidades</Link></li>
                  <li><Link href="#how" className="text-sm text-muted hover:text-ocean transition-colors font-semibold">Como funciona</Link></li>
                  <li><Link href="#showcase" className="text-sm text-muted hover:text-ocean transition-colors font-semibold">Preview</Link></li>
                  <li><Link href="#faq" className="text-sm text-muted hover:text-ocean transition-colors font-semibold">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-black text-ocean uppercase tracking-widest mb-4">Conta</h4>
                <ul className="space-y-2.5">
                  <li><Link href="/login" className="text-sm text-muted hover:text-ocean transition-colors font-semibold">Entrar</Link></li>
                  <li><Link href="/register" className="text-sm text-muted hover:text-ocean transition-colors font-semibold">Criar conta</Link></li>
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h4 className="text-xs font-black text-ocean uppercase tracking-widest mb-4">Legal</h4>
                <ul className="space-y-2.5">
                  <li><Link href="/terms" className="text-sm text-muted hover:text-ocean transition-colors font-semibold">Termos de Uso</Link></li>
                  <li><Link href="#" className="text-sm text-muted hover:text-ocean transition-colors font-semibold">Privacidade</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-muted">&copy; {new Date().getFullYear()} LinkWave — Todos os direitos reservados</span>
            <span className="text-xs text-muted/60">
              Feito por <span className="text-sky-600 font-bold">Gabriel Sabino</span>, <span className="text-sky-600 font-bold">Emelly Giovanini</span> & <span className="text-sky-600 font-bold">Lucas Castilho</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
