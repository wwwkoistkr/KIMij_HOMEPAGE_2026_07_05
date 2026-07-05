'use client';
// 상담문의 관리: 목록/검색/상태필터/상세/메모/상태변경/삭제/CSV
import { useCallback, useEffect, useState } from 'react';

type Inquiry = {
  id: number; name: string; phone: string; email: string; category: string; message: string;
  status: string; adminMemo: string; createdAt: string;
};

const STATUSES = ['신규', '연락완료', '종결'];

export default function InquiriesAdmin() {
  const [list, setList] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState('전체');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<Inquiry | null>(null);
  const [memo, setMemo] = useState('');

  const load = useCallback(async () => {
    const res = await fetch('/api/inquiries');
    if (res.ok) setList(await res.json());
  }, []);
  useEffect(() => { load(); }, [load]);

  const shown = list.filter((x) =>
    (filter === '전체' || x.status === filter) &&
    (!q || [x.name, x.phone, x.message, x.category].some((f) => f.includes(q)))
  );

  const update = async (id: number, patch: Partial<Inquiry>) => {
    await fetch(`/api/inquiries/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch)
    });
    await load();
  };

  const remove = async (id: number) => {
    if (!confirm('이 문의를 삭제할까요? 되돌릴 수 없습니다.')) return;
    await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
    setSel(null);
    await load();
  };

  const exportCsv = () => {
    const rows = [['접수일시', '이름', '연락처', '이메일', '분야', '상태', '내용', '메모'],
      ...shown.map((x) => [x.createdAt, x.name, x.phone, x.email, x.category, x.status, x.message, x.adminMemo])];
    const csv = '﻿' + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `상담문의_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold">상담문의 관리</h1>
        <button onClick={exportCsv} className="admin-btn admin-btn-ghost">⬇ CSV 내보내기</button>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {['전체', ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`admin-btn ${filter === s ? 'admin-btn-primary' : 'admin-btn-ghost'}`}>
            {s}{s !== '전체' && ` (${list.filter((x) => x.status === s).length})`}
          </button>
        ))}
        <input className="admin-input !w-56 ml-auto" placeholder="이름/연락처/내용 검색"
          value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-line)] overflow-x-auto">
        <table className="w-full admin-table">
          <thead><tr><th>접수일시</th><th>이름</th><th>연락처</th><th>분야</th><th>상태</th><th></th></tr></thead>
          <tbody>
            {shown.map((x) => (
              <tr key={x.id} className="hover:bg-[var(--color-bg-soft)]">
                <td className="whitespace-nowrap">{x.createdAt.slice(0, 16).replace('T', ' ')}</td>
                <td className="font-bold">{x.name}</td>
                <td>{x.phone}</td>
                <td>{x.category}</td>
                <td>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    x.status === '신규' ? 'bg-red-100 text-red-600' :
                    x.status === '연락완료' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                    {x.status}
                  </span>
                </td>
                <td><button className="admin-btn admin-btn-ghost" onClick={() => { setSel(x); setMemo(x.adminMemo); }}>상세</button></td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={6} className="text-center text-gray-400 py-10">문의가 없습니다.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* 상세 모달 */}
      {sel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSel(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-extrabold text-lg mb-4">문의 상세 #{sel.id}</h2>
            <dl className="space-y-2 text-sm">
              <Row k="이름" v={sel.name} /><Row k="연락처" v={sel.phone} />
              <Row k="이메일" v={sel.email || '-'} /><Row k="분야" v={sel.category} />
              <Row k="접수" v={sel.createdAt.slice(0, 16).replace('T', ' ')} />
            </dl>
            <p className="mt-4 p-4 bg-[var(--color-bg-soft)] rounded-lg text-sm whitespace-pre-wrap">{sel.message}</p>
            <label className="label mt-5" htmlFor="memo">처리 메모</label>
            <textarea id="memo" className="admin-input min-h-[80px]" value={memo} onChange={(e) => setMemo(e.target.value)} />
            <div className="flex flex-wrap gap-2 mt-4">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => { update(sel.id, { status: s, adminMemo: memo }); setSel(null); }}
                  className={`admin-btn ${sel.status === s ? 'admin-btn-primary' : 'admin-btn-ghost'}`}>
                  {s}로 변경
                </button>
              ))}
              <button onClick={() => { update(sel.id, { adminMemo: memo }); setSel(null); }} className="admin-btn admin-btn-primary">메모 저장</button>
              <button onClick={() => remove(sel.id)} className="admin-btn admin-btn-danger ml-auto">삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex"><dt className="w-20 text-gray-500 shrink-0">{k}</dt><dd className="font-medium">{v}</dd></div>;
}
