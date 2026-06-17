import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json();
  const { title, url, icon } = body;
  if (!title || !url) return NextResponse.json({ error: 'Missing title or url' }, { status: 400 });

  // compute next position
  const { data: maxRow } = await supabase.from('links').select('position').eq('user_id', session.user.id).order('position', { ascending: false }).limit(1).maybeSingle();
  const nextPos = (maxRow?.position ?? -1) + 1;

  const { data, error } = await supabase.from('links').insert([{ user_id: session.user.id, title, url, icon, position: nextPos }]).select().maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ link: data });
}

export async function PATCH(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json();
  const { id, title, url, icon, position } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  // ensure ownership
  const { data: existing } = await supabase.from('links').select('user_id').eq('id', id).maybeSingle();
  if (!existing || existing.user_id !== session.user.id) return NextResponse.json({ error: 'Not allowed' }, { status: 403 });

  const updates: any = {};
  if (title !== undefined) updates.title = title;
  if (url !== undefined) updates.url = url;
  if (icon !== undefined) updates.icon = icon;
  if (position !== undefined) updates.position = position;

  const { data, error } = await supabase.from('links').update(updates).eq('id', id).select().maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ link: data });
}

export async function DELETE(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  // ensure ownership
  const { data: existing } = await supabase.from('links').select('user_id').eq('id', id).maybeSingle();
  if (!existing || existing.user_id !== session.user.id) return NextResponse.json({ error: 'Not allowed' }, { status: 403 });

  const { error } = await supabase.from('links').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
