// 자료실 개별: 수정/삭제 (관리자)
import { NextRequest, NextResponse } from 'next/server';
import { db, persist, now } from '@/lib/db';
import { guard } from '@/lib/guard';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const g = await guard();
  if (g) return g;
  const { id } = await params;
  const d = await db();
  const p = d.posts.find((x) => x.id === Number(id));
  if (!p) return NextResponse.json({ error: '글을 찾을 수 없습니다.' }, { status: 404 });
  const b = await req.json();
  Object.assign(p, {
    ...(b.type !== undefined && { type: b.type === 'notice' ? 'notice' : 'blog' }),
    ...(b.topic !== undefined && { topic: b.topic }),
    ...(b.title !== undefined && { title: b.title }),
    ...(b.content !== undefined && { content: b.content }),
    ...(b.thumbnailUrl !== undefined && { thumbnailUrl: b.thumbnailUrl }),
    ...(b.isPinned !== undefined && { isPinned: !!b.isPinned }),
    ...(b.isPublished !== undefined && { isPublished: !!b.isPublished }),
    ...(b.publishedAt !== undefined && { publishedAt: b.publishedAt }),
    updatedAt: now()
  });
  await persist();
  return NextResponse.json(p);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const g = await guard();
  if (g) return g;
  const { id } = await params;
  const d = await db();
  d.posts = d.posts.filter((x) => x.id !== Number(id));
  await persist();
  return NextResponse.json({ ok: true });
}
