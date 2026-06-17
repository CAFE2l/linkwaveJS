import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!match) throw new Error('Invalid data URL');
  return { contentType: match[1], base64: match[2] };
}

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json();
  const { dataUrl, type } = body as { dataUrl: string; type: 'avatar' | 'banner' };
  if (!dataUrl || !type) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

  let parsed;
  try { parsed = parseDataUrl(dataUrl); } catch (err) { return NextResponse.json({ error: 'Invalid data URL' }, { status: 400 }); }

  const buffer = Buffer.from(parsed.base64, 'base64');
  const ext = parsed.contentType.split('/')[1] || 'png';
  const fileName = `${session.user.id}/${type}/${Date.now()}.${ext}`;
  const bucket = type === 'avatar' ? 'avatars' : 'banners';

  const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, buffer, { contentType: parsed.contentType, upsert: true });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  const publicUrl = data.publicUrl;

  // Persist URL in profiles table
  const column = type === 'avatar' ? 'avatar_url' : 'banner_url';
  const { error: updateError } = await supabase.from('profiles').update({ [column]: publicUrl }).eq('id', session.user.id);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ url: publicUrl });
}
