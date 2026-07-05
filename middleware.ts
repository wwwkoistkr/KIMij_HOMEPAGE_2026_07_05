// /admin 전 경로 인증 보호 (Edge 런타임 - Web Crypto로 HMAC 검증)
import { NextRequest, NextResponse } from 'next/server';

const COOKIE = 'kns_admin_session';

function toB64url(buf: ArrayBuffer) {
  let s = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(s: string) {
  return atob(s.replace(/-/g, '+').replace(/_/g, '/'));
}

async function verify(token: string | undefined, secret: string) {
  if (!token) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const mac = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  if (toB64url(mac) !== sig) return false;
  try {
    const data = JSON.parse(fromB64url(payload));
    return data.exp && data.exp > Date.now();
  } catch { return false; }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const ok = await verify(
      req.cookies.get(COOKIE)?.value,
      process.env.SESSION_SECRET || 'dev-secret-change-me'
    );
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
