// 자료실(공지/블로그): GET(관리자 목록) / POST(작성)
import { NextRequest, NextResponse } from 'next/server';
import { db, persist, nextId, now, type Post } from '@/lib/db';
import { guard } from '@/lib/guard';

export const dynamic = 'force-dynamic';

export async function GET() {
  const g = await guard();
  if (g) return g;
  const list = [...(await db()).posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const g = await guard();
  if (g) return g;
  const b = await req.json();
  if (!b.title) return NextResponse.json({ error: '제목은 필수입니다.' }, { status: 400 });
  const d = await db();
  const t = now();
  const p: Post = {
    id: await nextId('posts'),
    type: b.type === 'notice' ? 'notice' : 'blog',
    topic: b.topic || (b.type === 'notice' ? '공지' : '일반'),
    title: b.title,
    content: b.content || '',
    thumbnailUrl: b.thumbnailUrl || '',
    isPinned: !!b.isPinned,
    isPublished: b.isPublished !== false,
    viewCount: 0,
    publishedAt: b.publishedAt || t,
    createdAt: t,
    updatedAt: t
  };
  d.posts.push(p);
  await persist();
  return NextResponse.json(p);
}
