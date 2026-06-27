"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { userThemeSchema } from "@/lib/validations/profile";

type ActionState = {
  ok: boolean;
  message: string;
};

export async function updateThemeAction(
  input: unknown,
): Promise<ActionState> {
  const parsed = userThemeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Tema inválido.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const { error } = await supabase
    .from("users")
    .update({ theme_json: parsed.data as never })
    .eq("id", authUser.id);

  if (error) {
    return { ok: false, message: "Não foi possível salvar o tema." };
  }

  revalidatePath("/theme");
  revalidatePath("/dashboard/customize");
  revalidatePath("/u/*");
  return { ok: true, message: "Tema salvo." };
}
