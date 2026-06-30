import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPrisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/admin/auth";
import { normalizeUrl } from "@/lib/utils/url";

const updateLinkSchema = z.object({
  title: z.string().trim().min(2, "Informe um título.").max(60, "Use até 60 caracteres."),
  url: z.string().trim().min(4, "Informe uma URL.").max(400, "URL muito longa."),
  icon: z.string().trim().max(80, "Ícone muito longo.").optional().or(z.literal("")),
});

type Params = {
  params: Promise<{ id: string }>;
};

function revalidateAdminLinks(userId?: string) {
  revalidatePath("/admin/links");
  revalidatePath("/admin/overview");
  if (userId) revalidatePath(`/admin/users/${userId}/links`);
}

export async function PATCH(request: Request, { params }: Params) {
  const admin = await requireAdminApi();
  if (!admin.ok) {
    return NextResponse.json({ ok: false, message: admin.message }, { status: admin.status });
  }

  const { id } = await params;
  const parsed = updateLinkSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 },
    );
  }

  const current = await getPrisma().link.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!current) {
    return NextResponse.json({ ok: false, message: "Link não encontrado." }, { status: 404 });
  }

  const updated = await getPrisma().link.update({
    where: { id },
    data: {
      title: parsed.data.title,
      url: normalizeUrl(parsed.data.url),
      icon: parsed.data.icon || null,
    },
    include: {
      user: {
        select: { id: true, username: true, name: true, email: true, avatarUrl: true },
      },
    },
  });

  revalidateAdminLinks(current.userId);

  return NextResponse.json({
    ok: true,
    message: "Link atualizado.",
    link: {
      id: updated.id,
      title: updated.title,
      url: updated.url,
      icon: updated.icon,
      user_id: updated.userId,
      created_at: updated.createdAt.toISOString(),
      user: {
        id: updated.user.id,
        username: updated.user.username,
        name: updated.user.name,
        email: updated.user.email,
        avatar_url: updated.user.avatarUrl,
      },
    },
  });
}

export async function DELETE(_request: Request, { params }: Params) {
  const admin = await requireAdminApi();
  if (!admin.ok) {
    return NextResponse.json({ ok: false, message: admin.message }, { status: admin.status });
  }

  const { id } = await params;
  const current = await getPrisma().link.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!current) {
    return NextResponse.json({ ok: false, message: "Link não encontrado." }, { status: 404 });
  }

  await getPrisma().link.delete({ where: { id } });
  revalidateAdminLinks(current.userId);

  return NextResponse.json({ ok: true, message: "Link excluído." });
}
