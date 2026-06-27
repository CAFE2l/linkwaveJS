import Image from "next/image";
import Link from "next/link";

const sections = [
  {
    title: "Produto",
    links: [
      { label: "Recursos", href: "#recursos" },
      { label: "Como funciona", href: "#como-funciona" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Conta",
    links: [
      { label: "Login", href: "/login" },
      { label: "Cadastro", href: "/register" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
];

export function NewFooter(_props: { isLoggedIn?: boolean } = {}) {
  return (
    <footer className="mx-auto max-w-6xl px-5 pb-8 pt-16">
      <div className="glass-card-strong px-8 py-10">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <Image src="/brand/icon.png" alt="LinkWave" width={28} height={28} className="h-7 w-7" />
              <span className="text-base font-black text-ocean">LinkWave</span>
            </div>
            <p className="text-sm leading-relaxed text-muted max-w-xs">
              Sua onda de links pessoais. Minimalista, elegante, em segundos.
            </p>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-black text-ocean uppercase tracking-wider mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="footer-link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-muted">&copy; {new Date().getFullYear()} LinkWave &mdash; Todos os direitos reservados</span>
          <div className="flex gap-5">
            <Link href="#" className="text-xs font-bold text-muted hover:text-ocean transition-colors">Privacidade</Link>
            <Link href="#" className="text-xs font-bold text-muted hover:text-ocean transition-colors">Termos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
