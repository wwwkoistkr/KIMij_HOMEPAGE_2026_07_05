// 관리자 계정: 비밀번호 변경
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db, persist } from '@/lib/db';
import { guard } from '@/lib/guard';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest) {
  const g = await guard();
  if (g) return g;
  const { currentPassword, newPassword } = await req.json().catch(() => ({}));
  const d = await db();
  if (!bcrypt.compareSync(String(currentPassword || ''), d.admin.passwordHash)) {
    return NextResponse.json({ error: '현재 비밀번호가 올바르지 않습니다.' }, { status: 400 });
  }
  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return NextResponse.json({ error: '새 비밀번호는 8자 이상이어야 합니다.' }, { status: 400 });
  }
  d.admin.passwordHash = bcrypt.hashSync(newPassword, 10);
  await persist();
  return NextResponse.json({ ok: true });
}
