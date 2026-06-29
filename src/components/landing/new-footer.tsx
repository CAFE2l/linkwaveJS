import Image from "next/image";
import Link from "next/link";

export function NewFooter() {
  return (
    <footer className="px-5 pb-8 pt-4">
      <div className="mx-auto max-w-6xl">
        <div className="glass-card-strong rounded-2xl p-5 md:p-7">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-8">
            <div className="shrink-0">
              <div className="flex items-center gap-2 mb-2">
                <Image src="/brand/icon.png" alt="LinkWave" width={24} height={24} className="h-6 w-6" />
                <span className="text-base font-black text-ocean">LinkWave</span>
              </div>
              <p className="text-sm leading-snug text-muted mb-3">
                Create your page in minutes.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs text-white bg-gradient-to-b from-cyan-400 to-blue-500 border border-white/50 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Create Account
                <span className="text-white/70 text-xs">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 md:gap-8">
              <div>
                <h4 className="text-[10px] font-black text-ocean uppercase tracking-widest mb-3">Product</h4>
                <ul className="space-y-1.5">
                  <li><Link href="#features" className="text-xs text-muted hover:text-ocean transition-colors font-semibold">Features</Link></li>
                  <li><Link href="#how" className="text-xs text-muted hover:text-ocean transition-colors font-semibold">Preview</Link></li>
                  <li><Link href="#faq" className="text-xs text-muted hover:text-ocean transition-colors font-semibold">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-ocean uppercase tracking-widest mb-3">Account</h4>
                <ul className="space-y-1.5">
                  <li><Link href="/login" className="text-xs text-muted hover:text-ocean transition-colors font-semibold">Login</Link></li>
                  <li><Link href="/register" className="text-xs text-muted hover:text-ocean transition-colors font-semibold">Register</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-black text-ocean uppercase tracking-widest mb-3">Legal</h4>
                <ul className="space-y-1.5">
                  <li><Link href="/terms" className="text-xs text-muted hover:text-ocean transition-colors font-semibold">Terms</Link></li>
                  <li><Link href="#" className="text-xs text-muted hover:text-ocean transition-colors font-semibold">Privacy</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/30 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-[11px] text-muted/70">&copy; {new Date().getFullYear()} LinkWave</span>
            <span className="text-[11px] text-muted/50">
              Made with ❤️ by <span className="text-sky-600 font-bold">Gabriel Sabino</span>, <span className="text-sky-600 font-bold">Emelly Giovanini</span> & <span className="text-sky-600 font-bold">Lucas Castilho</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
