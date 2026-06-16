"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeUrl } from "@/lib/utils/url";
import {
  linkSchema,
  profileSchema,
  reorderLinksSchema,
} from "@/lib/validations/profile";

type ActionState = {
  ok: boolean;
  message: string;
};

async function getCurrentUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  return { supabase, userId: user.id, email: user.email ?? "" };
}

export async function updateProfileAction(
  input: unknown,
): Promise<ActionState> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const { supabase, userId, email } = await getCurrentUserId();
  const { username, bio, avatarUrl, theme } = parsed.data;

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .neq("id", userId)
    .maybeSingle();

  if (existing) {
    return { ok: false, message: "Este username já está em uso." };
  }

  const { error: userError } = await supabase.from("users").upsert({
    id: userId,
    email,
    username,
    name: username,
    avatar_url: avatarUrl || null,
    active: true,
  });

  const { error: profileError } = await supabase.from("profiles").upsert({
    user_id: userId,
    name: username,
    username,
    email,
    avatar_url: avatarUrl || null,
    active: true,
    bio: bio || null,
    theme,
    custom_colors: {},
  });

  if (userError || profileError) {
    return { ok: false, message: "Não foi possível atualizar o perfil." };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/u/${username}`);
  return { ok: true, message: "Perfil atualizado." };
}

export async function upsertLinkAction(
  input: unknown,
): Promise<ActionState> {
  const parsed = linkSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const { supabase, userId } = await getCurrentUserId();
  const { id, title, url, icon } = parsed.data;

  let orderPosition = 0;
  if (!id) {
    const { count } = await supabase
      .from("links")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);
    orderPosition = count ?? 0;
  }

  const payload = {
    user_id: userId,
    title,
    url: normalizeUrl(url),
    icon: icon || "link",
    ...(id ? { id } : { order_position: orderPosition }),
  } as const;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase.from("links").upsert(payload as any);

  if (error) {
    return { ok: false, message: "Não foi possível salvar o link." };
  }

  revalidatePath("/dashboard");
  return { ok: true, message: id ? "Link atualizado." : "Link criado." };
}

export async function deleteLinkAction(id: string): Promise<ActionState> {
  const { supabase, userId } = await getCurrentUserId();
  const { error } = await supabase
    .from("links")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return { ok: false, message: "Não foi possível excluir o link." };
  }

  revalidatePath("/dashboard");
  return { ok: true, message: "Link excluído." };
}

export async function reorderLinksAction(
  input: unknown,
): Promise<ActionState> {
  const parsed = reorderLinksSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Ordem inválida." };
  }

  const { supabase, userId } = await getCurrentUserId();

  const updates = parsed.data.ids.map((id, index) =>
    supabase
      .from("links")
      .update({ order_position: index })
      .eq("id", id)
      .eq("user_id", userId),
  );

  const results = await Promise.all(updates);
  if (results.some(({ error }) => error)) {
    return { ok: false, message: "Não foi possível reordenar os links." };
  }

  revalidatePath("/dashboard");
  return { ok: true, message: "Ordem atualizada." };
}
