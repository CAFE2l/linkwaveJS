"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const { data: user } = await supabase
    .from("users")
    .select("role")
    .eq("id", authUser.id)
    .single();

  if (!user || user.role !== "admin") redirect("/dashboard");

  return { authUser, admin: createAdminClient() };
}

function refreshAdmin() {
  revalidatePath("/admin/overview");
  revalidatePath("/admin/users");
  revalidatePath("/admin/links");
  revalidatePath("/admin/themes");
}

export async function getAdminUsers() {
  const { admin } = await requireAdmin();
  const { data: users } = await admin
    .from("users")
    .select("id, username, name, email, avatar_url, role, active, created_at")
    .order("created_at", { ascending: false });

  return users ?? [];
}

export async function createUserAdminAction(input: unknown): Promise<ActionState> {
  const parsed = createAdminUserSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { admin } = await requireAdmin();
  const { name, username, email, password, role, active } = parsed.data;

  const { data: duplicate } = await admin
    .from("users")
    .select("id")
    .or(`email.eq.${email},username.eq.${username}`)
    .maybeSingle();
  if (duplicate) return { ok: false, message: "Email ou username já cadastrado." };

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, username },
  });
  if (error || !data.user) {
    return { ok: false, message: error?.message ?? "Não foi possível criar o usuário." };
  }

  const userId = data.user.id;
  const finalRole = email === PRIMARY_ADMIN_EMAIL ? "admin" : role;
  const { error: userError } = await admin.from("users").upsert({
    id: userId,
    email,
    username,
    name,
    role: finalRole,
    active: email === PRIMARY_ADMIN_EMAIL ? true : active,
  }, { onConflict: "id" });

  const { error: profileError } = await admin.from("profiles").upsert({
    user_id: userId,
    name,
    username,
    email,
    active: email === PRIMARY_ADMIN_EMAIL ? true : active,
    theme: "wave",
    custom_colors: {},
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });

  if (userError || profileError) {
    await admin.auth.admin.deleteUser(userId);
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

  const { admin } = await requireAdmin();
  const { data: current } = await admin
    .from("users")
    .select("email")
    .eq("id", userId)
    .maybeSingle();
  if (!current) return { ok: false, message: "Usuário não encontrado." };

  const isPrimaryAdmin = current.email.toLowerCase() === PRIMARY_ADMIN_EMAIL;
  const values = parsed.data;
  if (isPrimaryAdmin && (values.role !== "admin" || !values.active)) {
    return { ok: false, message: "O administrador principal deve permanecer ativo e com role admin." };
  }

  const { data: duplicate } = await admin
    .from("users")
    .select("id")
    .or(`email.eq.${values.email},username.eq.${values.username}`)
    .neq("id", userId)
    .maybeSingle();
  if (duplicate) return { ok: false, message: "Email ou username já está em uso." };

  if (values.email !== current.email) {
    const { error: authError } = await admin.auth.admin.updateUserById(userId, {
      email: values.email,
      email_confirm: true,
    });
    if (authError) return { ok: false, message: "Não foi possível atualizar o email de autenticação." };
  }

  const finalValues = isPrimaryAdmin
    ? { ...values, email: PRIMARY_ADMIN_EMAIL, username: "gutiajs", role: "admin" as const, active: true }
    : values;

  const [{ error: userError }, { error: profileError }] = await Promise.all([
    admin.from("users").update(finalValues).eq("id", userId),
    admin.from("profiles").update({
      name: finalValues.name,
      username: finalValues.username,
      email: finalValues.email,
      active: finalValues.active,
      updated_at: new Date().toISOString(),
    }).eq("user_id", userId),
  ]);

  if (userError || profileError) {
    return { ok: false, message: "Não foi possível atualizar o usuário." };
  }

  refreshAdmin();
  return { ok: true, message: "Usuário atualizado." };
}

export async function deleteUserAdminAction(userId: string): Promise<ActionState> {
  const { authUser, admin } = await requireAdmin();
  if (userId === authUser.id) {
    return { ok: false, message: "Você não pode excluir a própria conta durante a sessão." };
  }

  const { data: user } = await admin
    .from("users")
    .select("email")
    .eq("id", userId)
    .maybeSingle();
  if (!user) return { ok: false, message: "Usuário não encontrado." };
  if (user.email.toLowerCase() === PRIMARY_ADMIN_EMAIL) {
    return { ok: false, message: "O administrador principal não pode ser excluído." };
  }

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { ok: false, message: "Não foi possível excluir o usuário." };

  refreshAdmin();
  return { ok: true, message: "Usuário excluído." };
}

export async function updateUserRoleAction(
  userId: string,
  role: "user" | "admin",
): Promise<ActionState> {
  const { admin } = await requireAdmin();
  const { data: user } = await admin
    .from("users")
    .select("name, username, email, active")
    .eq("id", userId)
    .single();
  if (!user) return { ok: false, message: "Usuário não encontrado." };
  return updateUserAdminAction(userId, { ...user, role });
}

export async function toggleUserActiveAction(
  userId: string,
  active: boolean,
): Promise<ActionState> {
  const { admin } = await requireAdmin();
  const { data: user } = await admin
    .from("users")
    .select("name, username, email, role")
    .eq("id", userId)
    .single();
  if (!user) return { ok: false, message: "Usuário não encontrado." };
  return updateUserAdminAction(userId, { ...user, active });
}

export async function deleteLinkAdminAction(linkId: string): Promise<ActionState> {
  const { admin } = await requireAdmin();
  const { error } = await admin.from("links").delete().eq("id", linkId);
  if (error) return { ok: false, message: "Erro ao excluir link." };
  refreshAdmin();
  return { ok: true, message: "Link excluído." };
}

export async function getAdminLinks() {
  const { admin } = await requireAdmin();
  const { data: links } = await admin
    .from("links")
    .select("id, title, url, icon, user_id, created_at")
    .order("created_at", { ascending: false })
    .limit(250);
  return links ?? [];
}

export async function resetUserThemeAction(userId: string): Promise<ActionState> {
  const { admin } = await requireAdmin();
  const { error } = await admin.from("users").update({ theme_json: {} }).eq("id", userId);
  if (error) return { ok: false, message: "Erro ao resetar tema." };
  refreshAdmin();
  return { ok: true, message: "Tema resetado para o padrão." };
}

export async function getAdminThemes() {
  const { admin } = await requireAdmin();
  const { data: users } = await admin
    .from("users")
    .select("id, username, email, theme_json, created_at")
    .not("theme_json", "is", null)
    .order("created_at", { ascending: false })
    .limit(100);

  return (users ?? []).filter(
    (user) =>
      user.theme_json &&
      typeof user.theme_json === "object" &&
      Object.keys(user.theme_json as Record<string, unknown>).length > 0,
  );
}
