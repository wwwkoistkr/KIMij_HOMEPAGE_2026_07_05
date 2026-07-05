// 서비스 카테고리: 추가 (관리자)
import { NextRequest, NextResponse } from 'next/server';
import { db, persist, nextId } from '@/lib/db';
import { guard } from '@/lib/guard';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const g = await guard();
  if (g) return g;
  const b = await req.json();
  if (!b.name) return NextResponse.json({ error: '카테고리 이름은 필수입니다.' }, { status: 400 });
  const d = await db();
  const c = { id: await nextId('categories'), name: b.name, sortOrder: Number(b.sortOrder) || d.categories.length };
  d.categories.push(c);
  await persist();
  return NextResponse.json(c);
}
