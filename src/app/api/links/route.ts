import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { normalizeUrl } from '@/lib/utils/url';
import type { Database } from '@/types/database';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, url, icon, is_custom_icon, icon_blob } = body;

    if (!title || !url) {
      return NextResponse.json({ ok: false, message: 'Título e URL são obrigatórios' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false, message: 'Não autenticado' }, { status: 401 });

    // compute order_position
    const { count } = await supabase.from('links').select('id', { head: true, count: 'exact' }).eq('user_id', user.id);
    const order_position = (count ?? 0);

    const insertPayload: Database["public"]["Tables"]["links"]["Insert"] = {
      user_id: user.id,
      title,
      url: normalizeUrl(url),
      icon: icon || null,
      is_custom_icon: is_custom_icon ?? false,
      icon_blob: icon_blob || null,
      order_position,
    };

    const { data, error } = await supabase.from('links').insert(insertPayload).select().single();
    if (error) {
      console.error('insert link err', error);
      return NextResponse.json({ ok: false, message: 'Erro ao salvar link' }, { status: 500 });
    }

    // revalidate dashboard path
    try { await import('next/cache').then(mod=>mod.revalidatePath && mod.revalidatePath('/dashboard')); } catch(e){}

    return NextResponse.json({ ok: true, message: 'Link criado', link: data });
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

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false, message: 'Não autenticado' }, { status: 401 });

    const updatePayload: Database["public"]["Tables"]["links"]["Update"] = {};
    if (title !== undefined) updatePayload.title = title;
    if (url !== undefined) updatePayload.url = normalizeUrl(url);
    if (icon !== undefined) updatePayload.icon = icon || null;
    if (is_custom_icon !== undefined) updatePayload.is_custom_icon = is_custom_icon;
    if (icon_blob !== undefined) updatePayload.icon_blob = icon_blob || null;

    const { data, error } = await supabase
      .from('links')
      .update(updatePayload)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('update link err', error);
      return NextResponse.json({ ok: false, message: 'Erro ao atualizar link' }, { status: 500 });
    }

    try { await import('next/cache').then(mod=>mod.revalidatePath && mod.revalidatePath('/dashboard')); } catch(e){}

    return NextResponse.json({ ok: true, message: 'Link atualizado', link: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, message: 'Erro interno' }, { status: 500 });
  }
}
