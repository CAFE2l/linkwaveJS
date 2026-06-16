import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

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
    <main className="aurora-shell flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-7">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <Image src="/brand/icon.png" alt="LinkWave" width={44} height={44} className="rounded-xl" />
          <span className="text-xl font-black">LinkWave</span>
        </Link>
        <h1 className="text-3xl font-black tracking-tight">{title}</h1>
        <p className="mt-2 leading-7 text-muted">{description}</p>
        <div className="mt-7">{children}</div>
        <div className="mt-7 text-center text-sm text-muted">{footer}</div>
      </Card>
    </main>
  );
}
