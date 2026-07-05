// 서비스 카테고리 개별: 수정/삭제 (관리자)
import { NextRequest, NextResponse } from 'next/server';
import { db, persist } from '@/lib/db';
import { guard } from '@/lib/guard';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const g = await guard();
  if (g) return g;
  const { id } = await params;
  const d = await db();
  const c = d.categories.find((x) => x.id === Number(id));
  if (!c) return NextResponse.json({ error: '카테고리를 찾을 수 없습니다.' }, { status: 404 });
  const b = await req.json();
  if (b.name !== undefined) c.name = b.name;
  if (b.sortOrder !== undefined) c.sortOrder = Number(b.sortOrder);
  await persist();
  return NextResponse.json(c);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const g = await guard();
  if (g) return g;
  const { id: idStr } = await params;
  const d = await db();
  const id = Number(idStr);
  if (d.services.some((s) => s.categoryId === id)) {
    return NextResponse.json({ error: '카테고리에 속한 서비스를 먼저 이동하거나 삭제해 주세요.' }, { status: 400 });
  }
  d.categories = d.categories.filter((x) => x.id !== id);
  await persist();
  return NextResponse.json({ ok: true });
}
