"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { normalizeUrl } from "@/lib/utils/url";
import { linkSchema, reorderLinksSchema } from "@/lib/validations/profile";

type ActionState = {
  ok: boolean;
  message: string;
};

export type UploadState = ActionState & { url?: string };

async function getCurrentUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  return { supabase, userId: user.id, email: user.email ?? "" };
}

import { redirect } from "next/navigation";
import type { Link } from "@/types/database";

export async function upsertLinkAction(
  input: unknown,
): Promise<ActionState & { link?: Link }> {
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

  const { data, error } = id
    ? await supabase.from("links").update({
        title,
        url: normalizeUrl(url),
        icon: icon || "link",
      } satisfies Partial<{
        title: string;
        url: string;
        icon: string;
      }>).eq("id", id).eq("user_id", userId).select().single()
    : await supabase.from("links").insert({
        user_id: userId,
        title,
        url: normalizeUrl(url),
        icon: icon || "link",
        order_position: orderPosition,
      } satisfies {
        user_id: string;
        title: string;
        url: string;
        icon: string;
        order_position: number;
      }).select().single();

  if (error) {
    return { ok: false, message: "Não foi possível salvar o link." };
  }

  revalidatePath("/dashboard");
  return { ok: true, message: id ? "Link atualizado." : "Link criado.", link: data ?? undefined };
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

export async function uploadAvatarAction(
  formData: FormData,
): Promise<UploadState> {
  const { supabase, userId } = await getCurrentUserId();
  const file = formData.get("file") as File;
  if (!file) return { ok: false, message: "Nenhum arquivo enviado." };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
  const fileName = `avatars/${userId}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("user-content")
    .upload(fileName, file, { upsert: true });

  if (uploadError) {
    return { ok: false, message: "Erro ao fazer upload." };
  }

  const { data: urlData } = supabase.storage
    .from("user-content")
    .getPublicUrl(fileName);

  const avatarUrl = urlData?.publicUrl ?? null;

  const { error: updateError } = await supabase
    .from("users")
    .update({ avatar_url: avatarUrl })
    .eq("id", userId);

  if (updateError) {
    return { ok: false, message: "Erro ao salvar avatar." };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard/customize");
  return { ok: true, message: "Avatar atualizado.", url: avatarUrl ?? undefined };
}

export async function uploadBannerAction(
  formData: FormData,
): Promise<UploadState> {
  const { supabase, userId } = await getCurrentUserId();
  const file = formData.get("file") as File;
  if (!file) return { ok: false, message: "Nenhum arquivo enviado." };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
  const fileName = `banners/${userId}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("user-content")
    .upload(fileName, file, { upsert: true });

  if (uploadError) {
    return { ok: false, message: "Erro ao fazer upload." };
  }

  const { data: urlData } = supabase.storage
    .from("user-content")
    .getPublicUrl(fileName);

  const bannerUrl = urlData?.publicUrl ?? null;

  const { error: updateError } = await supabase
    .from("users")
    .update({ banner_url: bannerUrl })
    .eq("id", userId);

  if (updateError) {
    return { ok: false, message: "Erro ao salvar banner." };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard/customize");
  return { ok: true, message: "Banner atualizado.", url: bannerUrl ?? undefined };
}
