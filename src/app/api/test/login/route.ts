import { NextResponse } from 'next/server';
import { getSupabaseConfig } from '@/lib/supabase/config';

export async function POST(req: Request) {
  // Only enabled in non-production or when explicitly allowed
  if (process.env.NODE_ENV === 'production' && !process.env.ENABLE_TEST_LOGIN) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
  }

  const { url, anonKey } = getSupabaseConfig();
  const tokenUrl = `${url.replace(/\/$/, '')}/auth/v1/token?grant_type=password`;

  const resp = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
    },
    body: JSON.stringify({ email, password }),
  });

  const payload = await resp.json();

  if (!resp.ok) {
    return NextResponse.json({ error: payload?.error || 'Auth failed' }, { status: 401 });
  }

  const accessToken = payload?.access_token;
  const refreshToken = payload?.refresh_token;
  const expiresIn = payload?.expires_in ?? 3600;

  const res = NextResponse.json({ ok: true });

  // Set cookies expected by supabase server-side client
  const secure = process.env.NODE_ENV === 'production';
  const cookieOptions = { path: '/', httpOnly: true, sameSite: 'lax' as const, secure };

  if (accessToken) res.cookies.set('sb-access-token', accessToken, cookieOptions);
  if (refreshToken) res.cookies.set('sb-refresh-token', refreshToken, cookieOptions);
  // Optional: set expiration cookie
  res.cookies.set('sb-expires-in', String(expiresIn), { path: '/', httpOnly: false });

  return res;
}
