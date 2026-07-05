'use client';
// 서비스·서류 안내 관리: 카테고리 + 서비스 풀 CRUD (공개 사이트 즉시 반영)
import { useCallback, useEffect, useState } from 'react';

type Cat = { id: number; name: string; sortOrder: number };
type Svc = {
  id: number; categoryId: number; title: string; slug: string; icon: string; summary: string;
  overview: string; target: string; documents: string; process: string[]; priceInfo: string;
  faq: { q: string; a: string }[]; sortOrder: number; isPublished: boolean;
};

const EMPTY: Omit<Svc, 'id'> = {
  categoryId: 0, title: '', slug: '', icon: '📋', summary: '', overview: '', target: '',
  documents: '', process: [], priceInfo: '', faq: [], sortOrder: 0, isPublished: true
};

export default function ServicesAdmin() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [list, setList] = useState<Svc[]>([]);
  const [edit, setEdit] = useState<(Omit<Svc, 'id'> & { id?: number }) | null>(null);
  const [newCat, setNewCat] = useState('');
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const res = await fetch('/api/services');
    if (res.ok) {
      const d = await res.json();
      setCats(d.categories.sort((a: Cat, b: Cat) => a.sortOrder - b.sortOrder));
      setList(d.services.sort((a: Svc, b: Svc) => a.sortOrder - b.sortOrder));
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const save = async () => {
    if (!edit) return;
    const isNew = !edit.id;
    const res = await fetch(isNew ? '/api/services' : `/api/services/${edit.id}`, {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edit)
    });
    if (res.ok) { setEdit(null); await load(); flash('저장되었습니다. 공개 사이트에 바로 반영됩니다.'); }
    else flash((await res.json()).error || '저장 실패');
  };

  const remove = async (id: number) => {
    if (!confirm('이 서비스를 삭제할까요?')) return;
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    await load();
  };

  const move = async (v: Svc, dir: -1 | 1) => {
    const siblings = list.filter((x) => x.categoryId === v.categoryId);
    const i = siblings.findIndex((x) => x.id === v.id);
    const j = i + dir;
    if (j < 0 || j >= siblings.length) return;
    await fetch(`/api/services/${v.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sortOrder: siblings[j].sortOrder }) });
    await fetch(`/api/services/${siblings[j].id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sortOrder: v.sortOrder }) });
    await load();
  };

  const addCat = async () => {
    if (!newCat.trim()) return;
    await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newCat }) });
    setNewCat('');
    await load();
  };

  const removeCat = async (id: number) => {
    if (!confirm('카테고리를 삭제할까요? (속한 서비스가 없어야 합니다)')) return;
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) flash((await res.json()).error);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold">서비스·서류 안내 관리</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => setEdit({ ...EMPTY, categoryId: cats[0]?.id || 0 })}>＋ 서비스 추가</button>
      </div>
      {msg && <p className="text-sm font-medium text-[var(--color-primary)]">{msg}</p>}

      {/* 카테고리 관리 */}
      <div className="bg-white rounded-xl border border-[var(--color-line)] p-5">
        <h2 className="font-bold mb-3">카테고리</h2>
        <div className="flex flex-wrap gap-2 items-center">
          {cats.map((c) => (
            <span key={c.id} className="inline-flex items-center gap-1.5 border border-[var(--color-line)] rounded-full px-3 py-1 text-sm">
              {c.name}
              <button aria-label={`${c.name} 삭제`} onClick={() => removeCat(c.id)} className="text-gray-400 hover:text-red-500">×</button>
            </span>
          ))}
          <input className="admin-input !w-40" placeholder="새 카테고리" value={newCat} onChange={(e) => setNewCat(e.target.value)} />
          <button className="admin-btn admin-btn-ghost" onClick={addCat}>추가</button>
        </div>
      </div>

      {/* 서비스 목록 */}
      {cats.map((c) => (
        <div key={c.id} className="bg-white rounded-xl border border-[var(--color-line)] p-5">
          <h2 className="font-bold mb-3">{c.name}</h2>
          <ul className="divide-y divide-[var(--color-line)]">
            {list.filter((v) => v.categoryId === c.id).map((v) => (
              <li key={v.id} className="flex items-center gap-3 py-3">
                <span className="text-xl">{v.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{v.title} {!v.isPublished && <span className="text-xs text-gray-400">(숨김)</span>}</p>
                  <p className="text-xs text-gray-400 truncate">/services/{v.slug} · {v.summary}</p>
                </div>
                <button className="admin-btn admin-btn-ghost !px-2" onClick={() => move(v, -1)} aria-label="위로">↑</button>
                <button className="admin-btn admin-btn-ghost !px-2" onClick={() => move(v, 1)} aria-label="아래로">↓</button>
                <button className="admin-btn admin-btn-ghost" onClick={() => setEdit(v)}>수정</button>
                <button className="admin-btn admin-btn-danger" onClick={() => remove(v.id)}>삭제</button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* 편집 모달 */}
      {edit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEdit(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[88vh] overflow-y-auto space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-extrabold text-lg">{edit.id ? '서비스 수정' : '서비스 추가'}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="label">서비스명 *</label><input className="admin-input" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></div>
              <div><label className="label">슬러그(URL) *</label><input className="admin-input" value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} placeholder="예: visa" /></div>
              <div><label className="label">아이콘(이모지)</label><input className="admin-input" value={edit.icon} onChange={(e) => setEdit({ ...edit, icon: e.target.value })} /></div>
              <div>
                <label className="label">카테고리</label>
                <select className="admin-input" value={edit.categoryId} onChange={(e) => setEdit({ ...edit, categoryId: Number(e.target.value) })}>
                  {cats.map((cc) => <option key={cc.id} value={cc.id}>{cc.name}</option>)}
                </select>
              </div>
            </div>
            <div><label className="label">한 줄 요약</label><input className="admin-input" value={edit.summary} onChange={(e) => setEdit({ ...edit, summary: e.target.value })} /></div>
            <div><label className="label">개요</label><textarea className="admin-input min-h-[70px]" value={edit.overview} onChange={(e) => setEdit({ ...edit, overview: e.target.value })} /></div>
            <div><label className="label">대상 (누가 필요한가)</label><textarea className="admin-input min-h-[50px]" value={edit.target} onChange={(e) => setEdit({ ...edit, target: e.target.value })} /></div>
            <div><label className="label">필요 서류 (쉼표로 구분)</label><textarea className="admin-input min-h-[50px]" value={edit.documents} onChange={(e) => setEdit({ ...edit, documents: e.target.value })} /></div>
            <div><label className="label">진행 절차 (한 줄에 한 단계)</label>
              <textarea className="admin-input min-h-[80px]" value={edit.process.join('\n')}
                onChange={(e) => setEdit({ ...edit, process: e.target.value.split('\n').filter(Boolean) })} /></div>
            <div><label className="label">비용 안내</label><input className="admin-input" value={edit.priceInfo} onChange={(e) => setEdit({ ...edit, priceInfo: e.target.value })} /></div>
            <div>
              <label className="label">FAQ</label>
              {edit.faq.map((f, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input className="admin-input" placeholder="질문" value={f.q}
                    onChange={(e) => setEdit({ ...edit, faq: edit.faq.map((x, j) => j === i ? { ...x, q: e.target.value } : x) })} />
                  <input className="admin-input" placeholder="답변" value={f.a}
                    onChange={(e) => setEdit({ ...edit, faq: edit.faq.map((x, j) => j === i ? { ...x, a: e.target.value } : x) })} />
                  <button className="admin-btn admin-btn-danger" onClick={() => setEdit({ ...edit, faq: edit.faq.filter((_, j) => j !== i) })}>×</button>
                </div>
              ))}
              <button className="admin-btn admin-btn-ghost" onClick={() => setEdit({ ...edit, faq: [...edit.faq, { q: '', a: '' }] })}>＋ FAQ 추가</button>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={edit.isPublished} onChange={(e) => setEdit({ ...edit, isPublished: e.target.checked })} />
              공개 사이트에 게시
            </label>
            <div className="flex gap-2 justify-end pt-2">
              <button className="admin-btn admin-btn-ghost" onClick={() => setEdit(null)}>취소</button>
              <button className="admin-btn admin-btn-primary" onClick={save}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
