"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { checkRegistrationRateLimit } from "@/lib/security/rate-limit";
import { normalizeEmail, normalizeUsername, sanitizeText } from "@/lib/security/sanitize";
import { getBaseUrl } from "@/lib/utils/url";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  usernameSchema,
} from "@/lib/validations/auth";

export type ActionState = {
  ok: boolean;
  message: string;
  redirectTo?: string;
  fieldErrors?: Record<string, string[]>;
};

function firstIp(value: string | null) {
  return value?.split(",")[0]?.trim() || "anonymous";
}

async function assertSameOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");
  const host = headerStore.get("host");

  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) return false;
    } catch {
      return false;
    }
  }

  return true;
}

export async function loginAction(input: unknown): Promise<ActionState> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { ok: false, message: "Email ou senha inválidos." };
  }

  revalidatePath("/", "layout");
  return { ok: true, message: "Login realizado." };
}

export async function registerUserAction(
  input: unknown,
): Promise<ActionState> {
  if (!(await assertSameOrigin())) {
    return { ok: false, message: "Origem da requisição inválida." };
  }

  const headerStore = await headers();
  const ip = firstIp(
    headerStore.get("x-forwarded-for") ||
      headerStore.get("x-real-ip") ||
      "anonymous",
  );

  const rateLimit = await checkRegistrationRateLimit(ip);
  if (!rateLimit.allowed) {
    return { ok: false, message: rateLimit.message };
  }

  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
      fieldErrors,
    };
  }

  const admin = createAdminClient();
  const name = sanitizeText(parsed.data.name);
  const email = normalizeEmail(parsed.data.email);
  const username = normalizeUsername(parsed.data.username);
  const { password } = parsed.data;

  const [{ data: existingUsername }, { data: existingProfileUsername }, { data: existingEmail }] =
    await Promise.all([
      admin
        .from("users")
        .select("id")
        .eq("username", username)
        .maybeSingle(),
      admin
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle(),
      admin
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle(),
    ]);

  if (existingUsername || existingProfileUsername) {
    return { ok: false, message: "Este username já está em uso." };
  }

  if (existingEmail) {
    return { ok: false, message: "Este email já está em uso." };
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      name,
      username,
    },
  });

  if (error || !data.user) {
    const alreadyRegistered = error?.message
      ?.toLowerCase()
      .includes("already registered");
    return {
      ok: false,
      message: alreadyRegistered
        ? "Este email já está em uso."
        : "Não foi possível criar a conta.",
    };
  }

  const userId = data.user.id;

  const { error: profileError } = await admin.from("profiles").upsert({
    user_id: userId,
    name,
    username,
    email,
    active: true,
    bio: "Minha onda de links.",
    theme: "wave",
    custom_colors: {},
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(userId);
    return {
      ok: false,
      message: "Não foi possível finalizar seu cadastro. Tente novamente.",
    };
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return {
      ok: true,
      message: "Conta criada com sucesso.",
      redirectTo: "/login",
    };
  }

  revalidatePath("/", "layout");
  return {
    ok: true,
    message: "Conta criada com sucesso.",
    redirectTo: "/onboarding",
  };
}

export async function checkUsernameAvailabilityAction(
  usernameInput: string,
): Promise<ActionState> {
  const parsed = usernameSchema.safeParse(usernameInput);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Username inválido.",
    };
  }

  const username = normalizeUsername(parsed.data);
  const admin = createAdminClient();

  const [{ data: user }, { data: profile }] = await Promise.all([
    admin
      .from("users")
      .select("id")
      .eq("username", username)
      .maybeSingle(),
    admin
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle(),
  ]);

  if (user || profile) {
    return { ok: false, message: "Este username já está em uso." };
  }

  return { ok: true, message: "Username disponível." };
}

export async function resetPasswordAction(
  input: unknown,
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Email inválido.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${getBaseUrl()}/reset-password`,
    },
  );

  if (error) {
    return {
      ok: false,
      message: "Não foi possível enviar a recuperação.",
    };
  }

  return {
    ok: true,
    message: "Enviamos as instruções para seu email.",
  };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
