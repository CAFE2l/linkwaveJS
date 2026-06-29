import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/firebase/auth-server';
import { prisma } from '@/lib/db/prisma';
import { normalizeUrl } from '@/lib/utils/url';

const updateLinkSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(60).optional(),
  url: z.string().min(1).max(400).optional(),
  icon: z.string().max(80).nullable().optional(),
  is_custom_icon: z.boolean().optional(),
  icon_blob: z.string().nullable().optional(),
  pinned: z.boolean().optional(),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ ok: false, message: 'Não autenticado' }, { status: 401 });

    const links = await prisma.link.findMany({
      where: { userId: user.uid },
      orderBy: { orderPosition: 'asc' },
      take: 200,
    });

    return NextResponse.json(links);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, message: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, url, icon, is_custom_icon, icon_blob } = body;

    if (!title || !url) {
      return NextResponse.json({ ok: false, message: 'Título e URL são obrigatórios' }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ ok: false, message: 'Não autenticado' }, { status: 401 });

    // compute orderPosition
    const count = await prisma.link.count({ where: { userId: user.uid } });
    const orderPosition = count;

    const link = await prisma.link.create({
      data: {
        userId: user.uid,
        title,
        url: normalizeUrl(url),
        icon: icon || null,
        isCustomIcon: is_custom_icon ?? false,
        iconBlob: icon_blob || null,
        orderPosition,
      },
    });

    // revalidate dashboard path
    try { await import('next/cache').then(mod=>mod.revalidatePath && mod.revalidatePath('/dashboard')); } catch {}

    return NextResponse.json({ ok: true, message: 'Link criado', link });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, message: 'Erro interno' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const parsed = updateLinkSchema.safeParse(await req.json().catch(() => null));

    if (!parsed.success) {
      return NextResponse.json({ ok: false, message: parsed.error.issues[0]?.message ?? 'Dados inválidos' }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ ok: false, message: 'Não autenticado' }, { status: 401 });

    const { id, title, url, icon, is_custom_icon, icon_blob, pinned } = parsed.data;

    if (pinned === true) {
      const pinnedCount = await prisma.link.count({
        where: {
          userId: user.uid,
          pinned: true,
          NOT: { id },
        },
      });

      if (pinnedCount >= 5) {
        return NextResponse.json(
          { ok: false, message: 'Você pode fixar no máximo 5 links.' },
          { status: 400 },
        );
      }
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (url !== undefined) updateData.url = normalizeUrl(url);
    if (icon !== undefined) updateData.icon = icon || null;
    if (is_custom_icon !== undefined) updateData.isCustomIcon = is_custom_icon;
    if (icon_blob !== undefined) updateData.iconBlob = icon_blob || null;
    if (pinned !== undefined) updateData.pinned = pinned;

    const link = await prisma.link.updateMany({
      where: { id, userId: user.uid },
      data: updateData,
    });

    if (link.count === 0) {
      return NextResponse.json({ ok: false, message: 'Link não encontrado' }, { status: 404 });
    }

    const updated = await prisma.link.findUnique({ where: { id } });

    try { await import('next/cache').then(mod=>mod.revalidatePath && mod.revalidatePath('/dashboard')); } catch {}

    return NextResponse.json({ ok: true, message: 'Link atualizado', link: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, message: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ ok: false, message: 'ID é obrigatório' }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ ok: false, message: 'Não autenticado' }, { status: 401 });

    const result = await prisma.link.deleteMany({
      where: { id, userId: user.uid },
    });

    if (result.count === 0) {
      return NextResponse.json({ ok: false, message: 'Link não encontrado' }, { status: 404 });
    }

    try { await import('next/cache').then(mod=>mod.revalidatePath && mod.revalidatePath('/dashboard')); } catch {}

    return NextResponse.json({ ok: true, message: 'Link excluído' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, message: 'Erro interno' }, { status: 500 });
  }
}
