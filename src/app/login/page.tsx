import { Suspense } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/shared/auth-card";
import { LoginForm } from "@/components/shared/login-form";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Entrar"
      description="Acesse seu painel para editar perfil, links e estatísticas."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link href="/register" className="font-bold text-brand">
            Cadastre-se
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-muted" />}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
