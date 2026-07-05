// 서비스: GET(관리자 전체 목록) / POST(추가)
import { NextRequest, NextResponse } from 'next/server';
import { db, persist, nextId, now, type Service } from '@/lib/db';
import { guard } from '@/lib/guard';

export const dynamic = 'force-dynamic';

export async function GET() {
  const g = await guard();
  if (g) return g;
  const d = await db();
  return NextResponse.json({ categories: d.categories, services: d.services });
}

export async function POST(req: NextRequest) {
  const g = await guard();
  if (g) return g;
  const b = await req.json();
  const d = await db();
  if (!b.title || !b.slug) return NextResponse.json({ error: '제목과 슬러그는 필수입니다.' }, { status: 400 });
  if (d.services.some((s) => s.slug === b.slug)) return NextResponse.json({ error: '이미 사용 중인 슬러그입니다.' }, { status: 400 });
  const t = now();
  const v: Service = {
    id: await nextId('services'),
    categoryId: Number(b.categoryId) || d.categories[0]?.id || 1,
    title: b.title, slug: b.slug, icon: b.icon || '📋',
    summary: b.summary || '', overview: b.overview || '', target: b.target || '',
    documents: b.documents || '', process: Array.isArray(b.process) ? b.process : [],
    priceInfo: b.priceInfo || '', faq: Array.isArray(b.faq) ? b.faq : [],
    sortOrder: Number(b.sortOrder) || 0, isPublished: b.isPublished !== false,
    createdAt: t, updatedAt: t
  };
  d.services.push(v);
  await persist();
  return NextResponse.json(v);
}
