import Image from "next/image";

export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-8">
      <div className="flex flex-col items-center justify-between gap-4 rounded-[1.5rem] border border-border bg-white/55 px-5 py-4 text-sm text-muted backdrop-blur-xl dark:bg-white/5 md:flex-row">
        <div className="flex items-center gap-2 font-black text-foreground">
          <Image src="/brand/icon.png" alt="" width={24} height={24} className="rounded-lg" />
          LinkWave
        </div>
        <span>© 2026 LinkWave - Todos os direitos reservados</span>
      </div>
    </footer>
  );
}
