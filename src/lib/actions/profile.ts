"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validations/profile";

type ActionState = {
  ok: boolean;
  message: string;
  profile?: {
    name: string;
    username: string;
    bio: string;
    avatarUrl: string;
    bannerUrl: string;
  };
};

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

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const { username, name, avatarUrl, bannerUrl, bio, theme } = parsed.data;

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .neq("id", authUser.id)
    .maybeSingle();

  if (existing) {
    return { ok: false, message: "Este username já está em uso." };
  }

  const { error: userError } = await supabase.from("users").update({
    username,
    name,
    avatar_url: avatarUrl || null,
    banner_url: bannerUrl || null,
  }).eq("id", authUser.id);

  if (userError) {
    return { ok: false, message: "Erro ao atualizar perfil." };
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    user_id: authUser.id,
    name,
    username,
    email: authUser.email ?? "",
    avatar_url: avatarUrl || null,
    active: true,
    bio: bio || null,
    theme,
    custom_colors: {},
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id", ignoreDuplicates: false });

  if (profileError) {
    return { ok: false, message: "Erro ao atualizar perfil." };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard/customize");
  revalidatePath(`/u/${username}`);
  return {
    ok: true,
    message: "Perfil atualizado.",
    profile: {
      name,
      username,
      bio: bio ?? "",
      avatarUrl: avatarUrl ?? "",
      bannerUrl: bannerUrl ?? "",
    },
  };
}
