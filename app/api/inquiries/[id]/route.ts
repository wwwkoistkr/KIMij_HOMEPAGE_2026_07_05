// 상담문의 개별: 상태/메모 변경, 삭제 (관리자)
import { NextRequest, NextResponse } from 'next/server';
import { db, persist, now } from '@/lib/db';
import { guard } from '@/lib/guard';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const g = await guard();
  if (g) return g;
  const { id } = await params;
  const d = await db();
  const q = d.inquiries.find((x) => x.id === Number(id));
  if (!q) return NextResponse.json({ error: '문의를 찾을 수 없습니다.' }, { status: 404 });
  const body = await req.json();
  if (body.status && ['신규', '연락완료', '종결'].includes(body.status)) {
    q.status = body.status;
    if (body.status !== '신규') q.handledAt = now();
  }
  if (typeof body.adminMemo === 'string') q.adminMemo = body.adminMemo;
  await persist();
  return NextResponse.json(q);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const g = await guard();
  if (g) return g;
  const { id } = await params;
  const d = await db();
  d.inquiries = d.inquiries.filter((x) => x.id !== Number(id));
  await persist();
  return NextResponse.json({ ok: true });
}
