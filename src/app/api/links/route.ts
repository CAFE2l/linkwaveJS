import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { normalizeUrl } from '@/lib/utils/url';

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

    const insertPayload: any = {
      user_id: user.id,
      title: title,
      url: normalizeUrl(url),
      icon: icon || null,
      is_custom_icon: is_custom_icon ? 1 : 0,
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
