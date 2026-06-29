import Image from "next/image";
import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";

export function NewFooter() {
  return (
    <footer className="px-4 pb-6 pt-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[1.75rem] border border-white/55 bg-white/18 px-5 py-6 shadow-xl shadow-cyan-950/10 backdrop-blur-[22px] sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_1.6fr] lg:items-start">
            <div className="flex flex-col items-start gap-3">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/brand/icon.png" alt="LinkWave" width={24} height={24} className="h-6 w-6" />
                <span className="text-base font-black text-ocean">LinkWave</span>
              </Link>
              <p className="text-sm font-semibold text-ocean/65">
                Create your page in minutes.
              </p>
              <Link
                href="/register"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 px-4 text-sm font-black text-white shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-500/30 active:scale-[0.98]"
              >
                <UserPlus size={15} />
                Create Account
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm sm:gap-8">
              <div>
                <h3 className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-ocean">Product</h3>
                <div className="flex flex-col gap-1.5">
                  <Link href="#recursos" className="font-semibold text-ocean/60 transition hover:text-ocean">Features</Link>
                  <Link href="#como-funciona" className="font-semibold text-ocean/60 transition hover:text-ocean">How it works</Link>
                  <Link href="#showcase" className="font-semibold text-ocean/60 transition hover:text-ocean">Preview</Link>
                  <Link href="#faq" className="font-semibold text-ocean/60 transition hover:text-ocean">FAQ</Link>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-ocean">Account</h3>
                <div className="flex flex-col gap-1.5">
                  <Link href="/login" className="font-semibold text-ocean/60 transition hover:text-ocean">Login</Link>
                  <Link href="/register" className="font-semibold text-ocean/60 transition hover:text-ocean">Register</Link>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-ocean">Legal</h3>
                <div className="flex flex-col gap-1.5">
                  <Link href="/privacy" className="font-semibold text-ocean/60 transition hover:text-ocean">Privacy</Link>
                  <Link href="/terms" className="font-semibold text-ocean/60 transition hover:text-ocean">Terms</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 border-t border-white/35 pt-4 text-xs font-semibold text-ocean/55 sm:flex-row sm:items-center sm:justify-between">
            <span>&copy; 2026 LinkWave</span>
            <span>Made with ❤️ by Gabriel Sabino, Emelly Giovanini & Lucas Castilho</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
