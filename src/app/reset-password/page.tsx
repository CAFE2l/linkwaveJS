import Link from "next/link";
import { AuthCard } from "@/components/shared/auth-card";
import { ResetPasswordForm } from "@/components/shared/reset-password-form";

export const metadata = {
  title: "Recuperar senha",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Recuperar senha"
      description="Receba um link seguro para redefinir sua senha."
      footer={
        <Link href="/login" className="font-bold text-brand">
          Voltar para login
        </Link>
      }
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
