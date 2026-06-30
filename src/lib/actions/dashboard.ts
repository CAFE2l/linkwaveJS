"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/firebase/auth-server";
import { normalizeUrl } from "@/lib/utils/url";
import { resolveLinkIcon } from "@/lib/utils/url-to-icon";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { linkSchema, reorderLinksSchema } from "@/lib/validations/profile";
import type { Link } from "@/types/database";

type ActionState = {
  ok: boolean;
  message: string;
};

export type UploadState = ActionState & { url?: string };

async function getCurrentUserId() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return { userId: user.uid, email: user.email ?? "" };
}

function mapLink(row: {
  id: string;
  userId: string;
  title: string;
  url: string;
  icon: string | null;
  icone: string | null;
  iconBlob: string | null;
  isCustomIcon: boolean;
  pinned: boolean;
  orderPosition: number;
  createdAt: Date;
}): Link {
  return {
    id: row.id,
    user_id: row.userId,
    title: row.title,
    url: row.url,
    icon: row.icon,
    icone: row.icone ?? null,
    icon_blob: row.iconBlob ?? null,
    is_custom_icon: row.isCustomIcon,
    pinned: row.pinned,
    order_position: row.orderPosition,
    created_at: row.createdAt.toISOString(),
  };
}

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

  const { userId } = await getCurrentUserId();
  const { id, title, url, icon } = parsed.data;

  try {
    if (id) {
      const updated = await getPrisma().link.update({
        where: { id },
        data: {
          title,
          url: normalizeUrl(url),
          icon: resolveLinkIcon(url, icon),
        },
      });
      revalidatePath("/dashboard");
      return { ok: true, message: "Link atualizado.", link: mapLink(updated) };
    }

    const count = await getPrisma().link.count({ where: { userId } });
    const created = await getPrisma().link.create({
      data: {
        userId,
        title,
        url: normalizeUrl(url),
        icon: resolveLinkIcon(url, icon),
        orderPosition: count,
      },
    });

    revalidatePath("/dashboard");
    return { ok: true, message: "Link criado.", link: mapLink(created) };
  } catch {
    return { ok: false, message: "Não foi possível salvar o link." };
  }
}

export async function deleteLinkAction(id: string): Promise<ActionState> {
  const { userId } = await getCurrentUserId();
  try {
    await getPrisma().link.deleteMany({
      where: { id, userId },
    });
  } catch {
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

  const { userId } = await getCurrentUserId();

  try {
    await Promise.all(
      parsed.data.ids.map((id, index) =>
        getPrisma().link.updateMany({
          where: { id, userId },
          data: { orderPosition: index },
        }),
      ),
    );
  } catch {
    return { ok: false, message: "Não foi possível reordenar os links." };
  }

  revalidatePath("/dashboard");
  return { ok: true, message: "Ordem atualizada." };
}

export async function uploadAvatarAction(
  formData: FormData,
): Promise<UploadState> {
  const { userId } = await getCurrentUserId();
  const file = formData.get("file") as File;
  if (!file) return { ok: false, message: "Nenhum arquivo enviado." };
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    return { ok: false, message: "Use uma imagem PNG, JPEG ou WebP." };
  }
  if (file.size > 2 * 1024 * 1024) {
    return { ok: false, message: "O avatar deve ter no máximo 2MB." };
  }

  const avatarUrl = await uploadToCloudinary(file, "avatars");
  if (!avatarUrl) {
    return { ok: false, message: "Erro ao fazer upload." };
  }

  try {
    await getPrisma().user.update({
      where: { id: userId },
      data: { avatarUrl },
    });

    await getPrisma().profile.update({
      where: { userId },
      data: { avatarUrl },
    });
  } catch {
    return { ok: false, message: "Erro ao salvar avatar." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/customize");
  revalidatePath("/u/*");
  return { ok: true, message: "Avatar atualizado.", url: avatarUrl };
}

export async function uploadBannerAction(
  formData: FormData,
): Promise<UploadState> {
  const { userId } = await getCurrentUserId();
  const file = formData.get("file") as File;
  if (!file) return { ok: false, message: "Nenhum arquivo enviado." };
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    return { ok: false, message: "Use uma imagem PNG, JPEG ou WebP." };
  }
  if (file.size > 4 * 1024 * 1024) {
    return { ok: false, message: "O banner deve ter no máximo 4MB." };
  }

  const bannerUrl = await uploadToCloudinary(file, "banners");
  if (!bannerUrl) {
    return { ok: false, message: "Erro ao fazer upload." };
  }

  try {
    await getPrisma().user.update({
      where: { id: userId },
      data: { bannerUrl },
    });
  } catch {
    return { ok: false, message: "Erro ao salvar banner." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/customize");
  return { ok: true, message: "Banner atualizado.", url: bannerUrl };
}
