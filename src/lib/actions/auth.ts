"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers, cookies } from "next/headers";
import { getPrisma } from "@/lib/db/prisma";
import { getAdminAuth } from "@/lib/firebase/admin";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getFirebaseConfig } from "@/lib/firebase/config";
import { checkRegistrationRateLimit } from "@/lib/security/rate-limit";
import { normalizeEmail, normalizeUsername, sanitizeText } from "@/lib/security/sanitize";
import { getBaseUrl } from "@/lib/utils/url";
import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  usernameSchema,
} from "@/lib/validations/auth";

function getServerAuth() {
  const app = getApps().length === 0 ? initializeApp(getFirebaseConfig()) : getApps()[0];
  return getAuth(app);
}

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

  try {
    const userCredential = await signInWithEmailAndPassword(
      getServerAuth(),
      parsed.data.email,
      parsed.data.password,
    );
    const idToken = await userCredential.user.getIdToken();
    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn: 60 * 60 * 24 * 14 * 1000,
    });

    const cookieStore = await cookies();
    cookieStore.set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });
  } catch {
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

  const name = sanitizeText(parsed.data.name);
  const email = normalizeEmail(parsed.data.email);
  const username = normalizeUsername(parsed.data.username);
  const { password } = parsed.data;

  const [existingUsername, existingProfileUsername, existingEmail] =
    await Promise.all([
      getPrisma().user.findFirst({ where: { username }, select: { id: true } }),
      getPrisma().profile.findFirst({ where: { username }, select: { id: true } }),
      getPrisma().user.findFirst({ where: { email }, select: { id: true } }),
    ]);

  if (existingUsername || existingProfileUsername) {
    return { ok: false, message: "Este username já está em uso." };
  }

  if (existingEmail) {
    return { ok: false, message: "Este email já está em uso." };
  }

  let userRecord;
  try {
    userRecord = await getAdminAuth().createUser({
      email,
      password,
      emailVerified: true,
      displayName: name,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    const alreadyRegistered = message.toLowerCase().includes("already exists");
    return {
      ok: false,
      message: alreadyRegistered
        ? "Este email já está em uso."
        : "Não foi possível criar a conta.",
    };
  }

  const userId = userRecord.uid;

  try {
    await getPrisma().$transaction(async (tx) => {
      await tx.user.create({
        data: { id: userId, email, username, name },
      });

      await tx.profile.create({
        data: {
          userId,
          name,
          username,
          email,
          active: true,
          bio: "Minha onda de links.",
          theme: "wave",
          customColors: {},
        },
      });
    });
  } catch {
    await getAdminAuth().deleteUser(userId);
    return {
      ok: false,
      message: "Não foi possível finalizar seu cadastro. Tente novamente.",
    };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      getServerAuth(),
      email,
      password,
    );
    const idToken = await userCredential.user.getIdToken();
    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn: 60 * 60 * 24 * 14 * 1000,
    });

    const cookieStore = await cookies();
    cookieStore.set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });
  } catch {
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
    redirectTo: "/dashboard",
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

  const [user, profile] = await Promise.all([
    getPrisma().user.findFirst({ where: { username }, select: { id: true } }),
    getPrisma().profile.findFirst({ where: { username }, select: { id: true } }),
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

  try {
    await sendPasswordResetEmail(getServerAuth(), parsed.data.email, {
      url: `${getBaseUrl()}/reset-password`,
    });
  } catch {
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
  const cookieStore = await cookies();
  cookieStore.set("__session", "", { maxAge: 0, path: "/" });
  revalidatePath("/", "layout");
  redirect("/");
}
