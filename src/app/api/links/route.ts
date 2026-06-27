import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/firebase/auth-server';
import { prisma } from '@/lib/db/prisma';
import { normalizeUrl } from '@/lib/utils/url';

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
    try { await import('next/cache').then(mod=>mod.revalidatePath && mod.revalidatePath('/dashboard')); } catch(e){}

    return NextResponse.json({ ok: true, message: 'Link criado', link });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, message: 'Erro interno' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, url, icon, is_custom_icon, icon_blob } = body;

    if (!id) {
      return NextResponse.json({ ok: false, message: 'ID é obrigatório' }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ ok: false, message: 'Não autenticado' }, { status: 401 });

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (url !== undefined) updateData.url = normalizeUrl(url);
    if (icon !== undefined) updateData.icon = icon || null;
    if (is_custom_icon !== undefined) updateData.isCustomIcon = is_custom_icon;
    if (icon_blob !== undefined) updateData.iconBlob = icon_blob || null;

    const link = await prisma.link.updateMany({
      where: { id, userId: user.uid },
      data: updateData,
    });

    if (link.count === 0) {
      return NextResponse.json({ ok: false, message: 'Link não encontrado' }, { status: 404 });
    }

    const updated = await prisma.link.findUnique({ where: { id } });

    try { await import('next/cache').then(mod=>mod.revalidatePath && mod.revalidatePath('/dashboard')); } catch(e){}

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

    try { await import('next/cache').then(mod=>mod.revalidatePath && mod.revalidatePath('/dashboard')); } catch(e){}

    return NextResponse.json({ ok: true, message: 'Link excluído' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, message: 'Erro interno' }, { status: 500 });
  }
}
