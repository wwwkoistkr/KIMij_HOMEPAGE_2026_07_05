'use client';
// 자료실 관리: 공지/블로그 풀 CRUD + 주제별 분류 + 이미지 업로드
import { useCallback, useEffect, useRef, useState } from 'react';

type Post = {
  id: number; type: 'notice' | 'blog'; topic: string; title: string; content: string;
  thumbnailUrl: string; isPinned: boolean; isPublished: boolean; viewCount: number; publishedAt: string;
};

const EMPTY: Omit<Post, 'id' | 'viewCount' | 'publishedAt'> = {
  type: 'blog', topic: '일반', title: '', content: '', thumbnailUrl: '', isPinned: false, isPublished: true
};

export default function PostsAdmin() {
  const [list, setList] = useState<Post[]>([]);
  const [typeFilter, setTypeFilter] = useState<'전체' | 'notice' | 'blog'>('전체');
  const [topicFilter, setTopicFilter] = useState('전체');
  const [q, setQ] = useState('');
  const [edit, setEdit] = useState<(typeof EMPTY & { id?: number }) | null>(null);
  const [msg, setMsg] = useState('');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/posts');
    if (res.ok) setList(await res.json());
  }, []);
  useEffect(() => { load(); }, [load]);

  const topics = Array.from(new Set(list.map((p) => p.topic)));
  const shown = list.filter((p) =>
    (typeFilter === '전체' || p.type === typeFilter) &&
    (topicFilter === '전체' || p.topic === topicFilter) &&
    (!q || p.title.includes(q) || p.content.includes(q))
  );

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const save = async () => {
    if (!edit) return;
    const isNew = !edit.id;
    const res = await fetch(isNew ? '/api/posts' : `/api/posts/${edit.id}`, {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edit)
    });
    if (res.ok) { setEdit(null); await load(); flash('저장되었습니다. 공개 사이트에 바로 반영됩니다.'); }
    else flash((await res.json()).error || '저장 실패');
  };

  const remove = async (id: number) => {
    if (!confirm('이 글을 삭제할까요?')) return;
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    await load();
  };

  // 이미지 업로드 → URL 반환
  const upload = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (!res.ok) { flash((await res.json()).error || '업로드 실패'); return null; }
    return (await res.json()).url;
  };

  const insertImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !edit) return;
    const url = await upload(file);
    if (!url) return;
    const tag = `\n<img src="${url}" alt="" />\n`;
    const ta = contentRef.current;
    const pos = ta ? ta.selectionStart : edit.content.length;
    setEdit({ ...edit, content: edit.content.slice(0, pos) + tag + edit.content.slice(pos) });
    e.target.value = '';
  };

  const setThumb = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !edit) return;
    const url = await upload(file);
    if (url) setEdit({ ...edit, thumbnailUrl: url });
    e.target.value = '';
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-extrabold">자료실 관리 <span className="text-sm text-gray-400 font-normal">(공지·블로그, 주제별 분류)</span></h1>
        <button className="admin-btn admin-btn-primary" onClick={() => setEdit({ ...EMPTY })}>＋ 새 글 쓰기</button>
      </div>
      {msg && <p className="text-sm font-medium text-[var(--color-primary)]">{msg}</p>}

      <div className="flex flex-wrap gap-2 items-center">
        {(['전체', 'notice', 'blog'] as const).map((tf) => (
          <button key={tf} onClick={() => setTypeFilter(tf)} className={`admin-btn ${typeFilter === tf ? 'admin-btn-primary' : 'admin-btn-ghost'}`}>
            {tf === '전체' ? '전체' : tf === 'notice' ? '공지' : '블로그'}
          </button>
        ))}
        <select className="admin-input !w-40" value={topicFilter} onChange={(e) => setTopicFilter(e.target.value)} aria-label="주제 필터">
          <option>전체</option>
          {topics.map((tp) => <option key={tp}>{tp}</option>)}
        </select>
        <input className="admin-input !w-56 ml-auto" placeholder="제목/내용 검색" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-line)] overflow-x-auto">
        <table className="w-full admin-table">
          <thead><tr><th>분류</th><th>주제</th><th>제목</th><th>게시일</th><th>조회</th><th>상태</th><th></th></tr></thead>
          <tbody>
            {shown.map((p) => (
              <tr key={p.id} className="hover:bg-[var(--color-bg-soft)]">
                <td>{p.type === 'notice' ? '공지' : '블로그'}</td>
                <td><span className="text-xs font-bold text-[var(--color-accent)]">{p.topic}</span></td>
                <td className="font-medium">{p.isPinned && '📌 '}{p.title}</td>
                <td className="whitespace-nowrap">{p.publishedAt.slice(0, 10)}</td>
                <td>{p.viewCount}</td>
                <td>{p.isPublished ? <span className="text-green-600 text-xs font-bold">게시</span> : <span className="text-gray-400 text-xs">임시</span>}</td>
                <td className="whitespace-nowrap">
                  <button className="admin-btn admin-btn-ghost" onClick={() => setEdit(p)}>수정</button>{' '}
                  <button className="admin-btn admin-btn-danger" onClick={() => remove(p.id)}>삭제</button>
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={7} className="text-center text-gray-400 py-10">글이 없습니다.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* 편집 모달 */}
      {edit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEdit(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[88vh] overflow-y-auto space-y-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-extrabold text-lg">{edit.id ? '글 수정' : '새 글 쓰기'}</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="label">분류</label>
                <select className="admin-input" value={edit.type} onChange={(e) => setEdit({ ...edit, type: e.target.value as 'notice' | 'blog' })}>
                  <option value="blog">블로그</option><option value="notice">공지</option>
                </select>
              </div>
              <div>
                <label className="label">주제 (자유 입력·기존 선택)</label>
                <input className="admin-input" list="topic-list" value={edit.topic} onChange={(e) => setEdit({ ...edit, topic: e.target.value })} />
                <datalist id="topic-list">{topics.map((tp) => <option key={tp} value={tp} />)}</datalist>
              </div>
              <div className="flex items-end gap-4 pb-1 text-sm font-medium">
                <label className="flex items-center gap-1.5"><input type="checkbox" checked={edit.isPinned} onChange={(e) => setEdit({ ...edit, isPinned: e.target.checked })} />상단 고정</label>
                <label className="flex items-center gap-1.5"><input type="checkbox" checked={edit.isPublished} onChange={(e) => setEdit({ ...edit, isPublished: e.target.checked })} />게시</label>
              </div>
            </div>
            <div><label className="label">제목 *</label><input className="admin-input" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="label !mb-0">본문 (HTML 사용 가능)</label>
                <label className="admin-btn admin-btn-ghost cursor-pointer text-xs">
                  🖼 이미지 삽입<input type="file" accept="image/*" className="hidden" onChange={insertImage} />
                </label>
              </div>
              <textarea ref={contentRef} className="admin-input min-h-[220px] font-mono text-sm" value={edit.content}
                onChange={(e) => setEdit({ ...edit, content: e.target.value })}
                placeholder="<p>내용을 입력하세요.</p> — 네이버 블로그 글을 복사해 붙여넣어도 됩니다." />
            </div>
            <div className="flex items-center gap-3">
              <label className="admin-btn admin-btn-ghost cursor-pointer text-xs">
                대표 이미지 업로드<input type="file" accept="image/*" className="hidden" onChange={setThumb} />
              </label>
              {edit.thumbnailUrl && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={edit.thumbnailUrl} alt="대표 이미지" className="h-14 rounded border" />
                  <button className="admin-btn admin-btn-danger" onClick={() => setEdit({ ...edit, thumbnailUrl: '' })}>제거</button>
                </>
              )}
            </div>
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
