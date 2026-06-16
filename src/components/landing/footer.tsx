import Image from "next/image";

export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-8">
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/25 bg-white/30 px-6 py-5 text-sm text-muted shadow-sm backdrop-blur-xl dark:bg-white/5 md:flex-row">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Image
              src="/brand/icon.png"
              alt=""
              width={22}
              height={22}
              className="rounded-lg"
            />
            <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-b from-white/40 to-transparent opacity-60" />
          </div>
          <span className="font-black text-foreground">LinkWave</span>
        </div>
        <span>&copy; 2026 LinkWave &mdash; Todos os direitos reservados</span>
      </div>
    </footer>
  );
}
