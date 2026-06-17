"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AppUser, Json } from "@/types/database";

type ActionState = {
  ok: boolean;
  message: string;
};

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

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return supabase;
}

export async function getAdminOverview() {
  await requireAdmin();
  const supabase = await createClient();
  const admin = await createAdminClient();

  const [{ count: totalUsers }, { count: totalLinks }, { count: totalClicks }] =
    await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("links").select("*", { count: "exact", head: true }),
      supabase.from("clicks").select("*", { count: "exact", head: true }),
    ]);

  const { data: recentUsers } = await supabase
    .from("users")
    .select("id, username, email, avatar_url, role, active, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: topLinks } = await supabase
    .from("links")
    .select("id, title, url, user_id, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: usersWithLinks } = await supabase
    .from("users")
    .select("id, username, email, role, active, created_at");

  return {
    totalUsers: totalUsers ?? 0,
    totalLinks: totalLinks ?? 0,
    totalClicks: totalClicks ?? 0,
    recentUsers: recentUsers ?? [],
    topLinks: topLinks ?? [],
    allUsers: usersWithLinks ?? [],
  };
}

export async function getAdminUsers() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("users")
    .select("id, username, name, email, avatar_url, role, active, created_at")
    .order("created_at", { ascending: false });

  return users ?? [];
}

export async function updateUserRoleAction(userId: string, role: "user" | "admin"): Promise<ActionState> {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", userId);

  if (error) return { ok: false, message: "Erro ao atualizar role." };

  revalidatePath("/admin/users");
  return { ok: true, message: `Usuário atualizado para ${role}.` };
}

export async function toggleUserActiveAction(userId: string, active: boolean): Promise<ActionState> {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("users")
    .update({ active })
    .eq("id", userId);

  if (error) return { ok: false, message: "Erro ao atualizar status." };

  revalidatePath("/admin/users");
  return { ok: true, message: active ? "Usuário ativado." : "Usuário desativado." };
}

export async function deleteLinkAdminAction(linkId: string): Promise<ActionState> {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase.from("links").delete().eq("id", linkId);

  if (error) return { ok: false, message: "Erro ao excluir link." };

  revalidatePath("/admin/links");
  return { ok: true, message: "Link excluído." };
}

export async function getAdminLinks() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: links } = await supabase
    .from("links")
    .select("id, title, url, icon, user_id, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return links ?? [];
}

export async function resetUserThemeAction(userId: string): Promise<ActionState> {
  await requireAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from("users")
    .update({ theme_json: {} })
    .eq("id", userId);

  if (error) return { ok: false, message: "Erro ao resetar tema." };

  revalidatePath("/admin/themes");
  return { ok: true, message: "Tema resetado para o padrão." };
}

export async function getAdminThemes() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("users")
    .select("id, username, email, theme_json, created_at")
    .not("theme_json", "is", null)
    .order("created_at", { ascending: false })
    .limit(50);

  return (users ?? []).filter((u) => u.theme_json && typeof u.theme_json === "object" && Object.keys(u.theme_json as Record<string, unknown>).length > 0);
}
