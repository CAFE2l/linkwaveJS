import Image from "next/image";

export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-8">
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/20 bg-white/35 px-6 py-5 text-sm shadow-sm backdrop-blur-md md:flex-row dark:border-[rgba(0,180,255,0.1)] dark:bg-[rgba(8,18,38,0.5)]">
        <div className="flex items-center gap-2.5">
          <Image
            src="/brand/icon.png"
            alt=""
            width={22}
            height={22}
            className="rounded-lg"
            style={{ filter: "drop-shadow(0 2px 4px rgba(80,180,220,0.3))" }}
          />
          <span className="font-black dark:text-[#80d0ff]" style={{ color: "#1a6a9a" }}>LinkWave</span>
        </div>
        <span className="dark:text-[#6090b0]" style={{ color: "#4f6d8a" }}>&copy; 2026 LinkWave &mdash; Todos os direitos reservados</span>
      </div>
    </footer>
  );
}
