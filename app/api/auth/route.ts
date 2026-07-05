// 관리자 로그인/로그아웃 (실패 5회 → 15분 잠금)
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db, persist, now } from '@/lib/db';
import { signSession, SESSION_COOKIE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json().catch(() => ({}));
  const d = await db();
  const admin = d.admin;

  if (admin.lockedUntil && new Date(admin.lockedUntil) > new Date()) {
    return NextResponse.json({ error: '로그인이 잠겼습니다. 15분 후 다시 시도해 주세요.' }, { status: 423 });
  }

  const ok = username === admin.username && bcrypt.compareSync(String(password || ''), admin.passwordHash);
  if (!ok) {
    admin.failedAttempts += 1;
    if (admin.failedAttempts >= 5) {
      admin.lockedUntil = new Date(Date.now() + 15 * 60_000).toISOString();
      admin.failedAttempts = 0;
    }
    await persist();
    return NextResponse.json({ error: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  admin.failedAttempts = 0;
  admin.lockedUntil = null;
  admin.lastLoginAt = now();
  await persist();

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, signSession(admin.username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 8 * 3600
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
