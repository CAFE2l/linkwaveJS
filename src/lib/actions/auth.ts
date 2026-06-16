"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/utils/url";
import { loginSchema, registerSchema, resetPasswordSchema } from "@/lib/validations/auth";

type ActionState = {
  ok: boolean;
  message: string;
};

export async function loginAction(input: unknown): Promise<ActionState> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { ok: false, message: "Email ou senha inválidos." };
  }

  revalidatePath("/", "layout");
  return { ok: true, message: "Login realizado." };
}

export async function registerAction(input: unknown): Promise<ActionState> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const supabase = await createClient();
  const { email, password, username } = parsed.data;

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existing) {
    return { ok: false, message: "Este username já está em uso." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: `${getBaseUrl()}/dashboard`,
    },
  });

  if (error || !data.user) {
    return { ok: false, message: error?.message ?? "Não foi possível criar a conta." };
  }

  await supabase.from("users").upsert({
    id: data.user.id,
    email,
    username,
    active: true,
  });

  await supabase.from("profiles").upsert({
    user_id: data.user.id,
    bio: "Minha onda de links.",
    theme: "wave",
    custom_colors: {},
  });

  revalidatePath("/", "layout");
  return { ok: true, message: "Conta criada. Verifique seu email se a confirmação estiver ativa." };
}

export async function resetPasswordAction(input: unknown): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Email inválido." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${getBaseUrl()}/reset-password`,
  });

  if (error) {
    return { ok: false, message: "Não foi possível enviar a recuperação." };
  }

  return { ok: true, message: "Enviamos as instruções para seu email." };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
