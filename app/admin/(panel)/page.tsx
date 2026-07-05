'use client';
// 실시간 대시보드: 20초 폴링으로 최신 현황 자동 반영
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

type Dash = {
  newCount: number; weekCount: number;
  trend: { date: string; count: number }[];
  statusDist: Record<string, number>;
  recentUnhandled: { id: number; name: string; category: string; createdAt: string }[];
  totals: { inquiries: number; posts: number; services: number };
};

export default function AdminDashboard() {
  const [d, setD] = useState<Dash | null>(null);
  const [updated, setUpdated] = useState('');

  const load = useCallback(async () => {
    const res = await fetch('/api/dashboard');
    if (res.ok) {
      setD(await res.json());
      setUpdated(new Date().toLocaleTimeString('ko-KR'));
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 20_000); // 실시간 폴링
    return () => clearInterval(t);
  }, [load]);

  if (!d) return <p className="text-gray-400 py-20 text-center">불러오는 중…</p>;

  const max = Math.max(1, ...d.trend.map((x) => x.count));

  const cards = [
    { label: '신규 문의', value: d.newCount, href: '/admin/inquiries', highlight: d.newCount > 0 },
    { label: '금주 문의', value: d.weekCount, href: '/admin/inquiries' },
    { label: '전체 게시글', value: d.totals.posts, href: '/admin/posts' },
    { label: '서비스', value: d.totals.services, href: '/admin/services' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-extrabold">대시보드</h1>
        <p className="text-xs text-gray-400">실시간 현황 · 마지막 갱신 {updated} (20초마다 자동)</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href}
            className={`rounded-xl p-5 border transition-shadow hover:shadow-md ${
              c.highlight ? 'bg-[var(--color-primary)] text-white border-transparent' : 'bg-white border-[var(--color-line)]'}`}>
            <p className={`text-sm ${c.highlight ? 'text-white/70' : 'text-gray-500'}`}>{c.label}</p>
            <p className="text-3xl font-extrabold mt-1">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 최근 7일 추이 미니차트 */}
        <div className="bg-white rounded-xl border border-[var(--color-line)] p-5">
          <h2 className="font-bold mb-4">최근 7일 접수 추이</h2>
          <div className="flex items-end gap-2 h-36">
            {d.trend.map((x) => (
              <div key={x.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500">{x.count}</span>
                <div className="w-full rounded-t bg-[var(--color-primary)]"
                  style={{ height: `${(x.count / max) * 100}%`, minHeight: x.count ? 6 : 2, opacity: x.count ? 1 : 0.15 }} />
                <span className="text-[10px] text-gray-400">{x.date.slice(5)}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 text-sm">
            {Object.entries(d.statusDist).map(([k, v]) => (
              <span key={k} className="text-gray-500">{k} <b className="text-[var(--color-ink)]">{v}</b></span>
            ))}
          </div>
        </div>

        {/* 미확인 문의 */}
        <div className="bg-white rounded-xl border border-[var(--color-line)] p-5">
          <h2 className="font-bold mb-4">미확인 상담문의</h2>
          {d.recentUnhandled.length === 0 ? (
            <p className="text-gray-400 text-sm py-8 text-center">미확인 문의가 없습니다 👍</p>
          ) : (
            <ul className="divide-y divide-[var(--color-line)]">
              {d.recentUnhandled.map((q) => (
                <li key={q.id}>
                  <Link href="/admin/inquiries" className="flex justify-between py-3 text-sm hover:bg-[var(--color-bg-soft)] px-2 rounded">
                    <span><b>{q.name}</b> · {q.category}</span>
                    <span className="text-gray-400">{q.createdAt.slice(5, 16).replace('T', ' ')}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 외부 연결 위젯 자리 (설계도 §3.2-b) */}
      <div className="grid lg:grid-cols-2 gap-6">
        {['📅 오늘/이번 주 일정 (캘린더)', '✉️ 최근 수신·미답장 메일'].map((w) => (
          <div key={w} className="rounded-xl border border-dashed border-[var(--color-line)] p-5 text-center text-gray-400 text-sm">
            <p className="font-medium">{w}</p>
            <p className="mt-1">외부 서비스 연결 시 실시간 위젯이 표시됩니다.</p>
            <button className="admin-btn admin-btn-ghost mt-3" disabled>연결하기 (준비 중)</button>
          </div>
        ))}
      </div>
    </div>
  );
}
