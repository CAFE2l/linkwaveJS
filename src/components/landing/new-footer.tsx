import Image from "next/image";
import Link from "next/link";

export function NewFooter() {
  return (
    <footer className="px-4 pb-6 pt-2">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4 h-[60px] px-5 md:px-6 rounded-full backdrop-blur-[20px] border border-white/25 bg-white/12 shadow-sm">
          <div className="flex items-center gap-2 shrink-0">
            <Image src="/brand/icon.png" alt="LinkWave" width={20} height={20} className="h-5 w-5" />
            <span className="text-sm font-black text-ocean hidden sm:inline">LinkWave</span>
          </div>

          <span className="text-[11px] text-muted/60 text-center hidden md:block">
            &copy; {new Date().getFullYear()} LinkWave — All rights reserved
          </span>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/login" className="text-xs font-bold text-muted hover:text-ocean-light transition-all duration-200 hover:opacity-80">
              Login
            </Link>
            <Link href="/register" className="text-xs font-bold text-muted hover:text-ocean-light transition-all duration-200 hover:opacity-80">
              Register
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
