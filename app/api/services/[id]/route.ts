// 서비스 개별: 수정/삭제 (관리자)
import { NextRequest, NextResponse } from 'next/server';
import { db, persist, now } from '@/lib/db';
import { guard } from '@/lib/guard';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const g = await guard();
  if (g) return g;
  const { id } = await params;
  const d = await db();
  const v = d.services.find((x) => x.id === Number(id));
  if (!v) return NextResponse.json({ error: '서비스를 찾을 수 없습니다.' }, { status: 404 });
  const b = await req.json();
  if (b.slug && b.slug !== v.slug && d.services.some((s) => s.slug === b.slug)) {
    return NextResponse.json({ error: '이미 사용 중인 슬러그입니다.' }, { status: 400 });
  }
  Object.assign(v, {
    ...(b.categoryId !== undefined && { categoryId: Number(b.categoryId) }),
    ...(b.title !== undefined && { title: b.title }),
    ...(b.slug !== undefined && { slug: b.slug }),
    ...(b.icon !== undefined && { icon: b.icon }),
    ...(b.summary !== undefined && { summary: b.summary }),
    ...(b.overview !== undefined && { overview: b.overview }),
    ...(b.target !== undefined && { target: b.target }),
    ...(b.documents !== undefined && { documents: b.documents }),
    ...(Array.isArray(b.process) && { process: b.process }),
    ...(b.priceInfo !== undefined && { priceInfo: b.priceInfo }),
    ...(Array.isArray(b.faq) && { faq: b.faq }),
    ...(b.sortOrder !== undefined && { sortOrder: Number(b.sortOrder) }),
    ...(b.isPublished !== undefined && { isPublished: !!b.isPublished }),
    updatedAt: now()
  });
  await persist();
  return NextResponse.json(v);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const g = await guard();
  if (g) return g;
  const { id } = await params;
  const d = await db();
  d.services = d.services.filter((x) => x.id !== Number(id));
  await persist();
  return NextResponse.json({ ok: true });
}
