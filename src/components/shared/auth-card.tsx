import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
      <div className="card w-full max-w-md p-7">
        <Link href="/" className="mb-6 flex items-center gap-3">
          <Image src="/brand/icon.png" alt="LinkWave" width={40} height={40} className="rounded-xl" />
          <span className="text-lg font-bold text-foreground">LinkWave</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-fg-secondary">{description}</p>
        <div className="mt-6">{children}</div>
        <div className="mt-6 text-center text-sm text-fg-secondary">{footer}</div>
      </div>
    </main>
  );
}
