// 실시간 대시보드 데이터 (관리자, 폴링용)
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { guard } from '@/lib/guard';

export const dynamic = 'force-dynamic';

export async function GET() {
  const g = await guard();
  if (g) return g;
  const d = await db();
  const nowD = new Date();
  const weekAgo = new Date(nowD.getTime() - 7 * 86400_000);

  const newCount = d.inquiries.filter((q) => q.status === '신규').length;
  const weekCount = d.inquiries.filter((q) => new Date(q.createdAt) >= weekAgo).length;

  // 최근 7일 접수 추이
  const trend: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(nowD.getTime() - i * 86400_000).toISOString().slice(0, 10);
    trend.push({ date: day, count: d.inquiries.filter((q) => q.createdAt.slice(0, 10) === day).length });
  }

  const statusDist = {
    신규: newCount,
    연락완료: d.inquiries.filter((q) => q.status === '연락완료').length,
    종결: d.inquiries.filter((q) => q.status === '종결').length
  };

  const recentUnhandled = d.inquiries.filter((q) => q.status === '신규')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return NextResponse.json({
    newCount, weekCount, trend, statusDist, recentUnhandled,
    totals: { inquiries: d.inquiries.length, posts: d.posts.length, services: d.services.length }
  });
}
