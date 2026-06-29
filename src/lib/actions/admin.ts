"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { getAdminAuth } from "@/lib/firebase/admin";
import { getCurrentUser } from "@/lib/firebase/auth-server";
import { usernameSchema } from "@/lib/validations/auth";

const PRIMARY_ADMIN_EMAIL = "gutiajs@gmail.com";

type ActionState = {
  ok: boolean;
  message: string;
};

const adminUserSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome.").max(80, "Nome muito longo."),
  username: usernameSchema,
  email: z.string().trim().toLowerCase().email("Email inválido."),
  role: z.enum(["user", "admin"]),
  active: z.boolean(),
});

const createAdminUserSchema = adminUserSchema.extend({
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres.").max(128),
});

async function requireAdmin() {
  const authUser = await getCurrentUser();
  if (!authUser) redirect("/login");

  const user = await prisma.user.findFirst({
    where: { id: authUser.uid },
    select: { role: true },
  });

  if (!user || user.role !== "admin") redirect("/dashboard");

  return { authUser };
}

function refreshAdmin() {
  revalidatePath("/admin/overview");
  revalidatePath("/admin/users");
  revalidatePath("/admin/links");
  revalidatePath("/admin/themes");
}

export async function getAdminUsers() {
  await requireAdmin();
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      avatarUrl: true,
      role: true,
      active: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return users.map((u) => ({
    id: u.id,
    username: u.username,
    name: u.name,
    email: u.email,
    avatar_url: u.avatarUrl,
    role: u.role as "user" | "admin",
    active: u.active,
    created_at: u.createdAt.toISOString(),
  }));
}

export async function createUserAdminAction(input: unknown): Promise<ActionState> {
  const parsed = createAdminUserSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await requireAdmin();
  const { name, username, email, password, role, active } = parsed.data;

  const duplicate = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { id: true },
  });
  if (duplicate) return { ok: false, message: "Email ou username já cadastrado." };

  let userRecord;
  try {
    userRecord = await getAdminAuth().createUser({
      email,
      password,
      emailVerified: true,
      displayName: name,
    });
  } catch (error: unknown) {
    return { ok: false, message: error instanceof Error ? error.message : "Não foi possível criar o usuário." };
  }

  const userId = userRecord.uid;
  const finalRole = email === PRIMARY_ADMIN_EMAIL ? "admin" : role;

  try {
    await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email,
        username,
        name,
        role: finalRole,
        active: email === PRIMARY_ADMIN_EMAIL ? true : active,
      },
      update: {
        email,
        username,
        name,
        role: finalRole,
        active: email === PRIMARY_ADMIN_EMAIL ? true : active,
      },
    });

    await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        name,
        username,
        email,
        active: email === PRIMARY_ADMIN_EMAIL ? true : active,
        theme: "wave",
        customColors: {},
      },
      update: {
        name,
        username,
        email,
        active: email === PRIMARY_ADMIN_EMAIL ? true : active,
        theme: "wave",
        customColors: {},
      },
    });
  } catch {
    await getAdminAuth().deleteUser(userId);
    return { ok: false, message: "A conta não pôde ser sincronizada com o perfil." };
  }

  refreshAdmin();
  return { ok: true, message: "Usuário criado com sucesso." };
}

export async function updateUserAdminAction(
  userId: string,
  input: unknown,
): Promise<ActionState> {
  const parsed = adminUserSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await requireAdmin();

  const current = await prisma.user.findFirst({
    where: { id: userId },
    select: { email: true },
  });
  if (!current) return { ok: false, message: "Usuário não encontrado." };

  const isPrimaryAdmin = current.email.toLowerCase() === PRIMARY_ADMIN_EMAIL;
  const values = parsed.data;
  if (isPrimaryAdmin && (values.role !== "admin" || !values.active)) {
    return { ok: false, message: "O administrador principal deve permanecer ativo e com role admin." };
  }

  const duplicate = await prisma.user.findFirst({
    where: { OR: [{ email: values.email }, { username: values.username }], NOT: { id: userId } },
    select: { id: true },
  });
  if (duplicate) return { ok: false, message: "Email ou username já está em uso." };

  if (values.email !== current.email) {
    try {
      await getAdminAuth().updateUser(userId, { email: values.email, emailVerified: true });
    } catch {
      return { ok: false, message: "Não foi possível atualizar o email de autenticação." };
    }
  }

  const finalValues = isPrimaryAdmin
    ? { ...values, email: PRIMARY_ADMIN_EMAIL, username: "gutiajs", role: "admin" as const, active: true }
    : values;

  try {
    await Promise.all([
      prisma.user.update({
        where: { id: userId },
        data: finalValues,
      }),
      prisma.profile.update({
        where: { userId },
        data: {
          name: finalValues.name,
          username: finalValues.username,
          email: finalValues.email,
          active: finalValues.active,
        },
      }),
    ]);
  } catch {
    return { ok: false, message: "Não foi possível atualizar o usuário." };
  }

  refreshAdmin();
  return { ok: true, message: "Usuário atualizado." };
}

export async function deleteUserAdminAction(userId: string): Promise<ActionState> {
  const { authUser } = await requireAdmin();
  if (userId === authUser.uid) {
    return { ok: false, message: "Você não pode excluir a própria conta durante a sessão." };
  }

  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { email: true },
  });
  if (!user) return { ok: false, message: "Usuário não encontrado." };
  if (user.email.toLowerCase() === PRIMARY_ADMIN_EMAIL) {
    return { ok: false, message: "O administrador principal não pode ser excluído." };
  }

  try {
    await getAdminAuth().deleteUser(userId);
  } catch {
    return { ok: false, message: "Não foi possível excluir o usuário." };
  }

  refreshAdmin();
  return { ok: true, message: "Usuário excluído." };
}

export async function updateUserRoleAction(
  userId: string,
  role: "user" | "admin",
): Promise<ActionState> {
  await requireAdmin();
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { name: true, username: true, email: true, active: true },
  });
  if (!user) return { ok: false, message: "Usuário não encontrado." };
  return updateUserAdminAction(userId, { ...user, role });
}

export async function toggleUserActiveAction(
  userId: string,
  active: boolean,
): Promise<ActionState> {
  await requireAdmin();
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { name: true, username: true, email: true, role: true },
  });
  if (!user) return { ok: false, message: "Usuário não encontrado." };
  return updateUserAdminAction(userId, { ...user, active });
}

export async function deleteLinkAdminAction(linkId: string): Promise<ActionState> {
  await requireAdmin();
  try {
    await prisma.link.delete({ where: { id: linkId } });
  } catch {
    return { ok: false, message: "Erro ao excluir link." };
  }
  refreshAdmin();
  return { ok: true, message: "Link excluído." };
}

export async function getAdminLinks() {
  await requireAdmin();
  const links = await prisma.link.findMany({
    select: { id: true, title: true, url: true, icon: true, userId: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 250,
  });

  return links.map((l) => ({
    id: l.id,
    title: l.title,
    url: l.url,
    icon: l.icon,
    user_id: l.userId,
    created_at: l.createdAt.toISOString(),
  }));
}

export async function resetUserThemeAction(userId: string): Promise<ActionState> {
  await requireAdmin();
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { themeJson: {} },
    });
  } catch {
    return { ok: false, message: "Erro ao resetar tema." };
  }
  refreshAdmin();
  return { ok: true, message: "Tema resetado para o padrão." };
}

export async function getAdminThemes() {
  await requireAdmin();
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true, themeJson: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return users
    .map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      theme_json: u.themeJson,
      created_at: u.createdAt.toISOString(),
    }))
    .filter(
      (user) =>
        user.theme_json &&
        typeof user.theme_json === "object" &&
        Object.keys(user.theme_json as Record<string, unknown>).length > 0,
    );
}
