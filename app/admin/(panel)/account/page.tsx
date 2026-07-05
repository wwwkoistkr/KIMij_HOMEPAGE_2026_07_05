'use client';
// 계정 설정: 비밀번호 변경
import { useState } from 'react';

export default function AccountAdmin() {
  const [cur, setCur] = useState('');
  const [next, setNext] = useState('');
  const [next2, setNext2] = useState('');
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 8) { setOk(false); setMsg('새 비밀번호는 8자 이상이어야 합니다.'); return; }
    if (next !== next2) { setOk(false); setMsg('새 비밀번호가 서로 일치하지 않습니다.'); return; }
    const res = await fetch('/api/account', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: cur, newPassword: next })
    });
    const d = await res.json();
    setOk(res.ok);
    setMsg(res.ok ? '비밀번호가 변경되었습니다.' : d.error);
    if (res.ok) { setCur(''); setNext(''); setNext2(''); }
  };

  return (
    <div className="max-w-md space-y-5">
      <h1 className="text-2xl font-extrabold">계정 설정</h1>
      <form onSubmit={submit} className="bg-white rounded-xl border border-[var(--color-line)] p-6 space-y-4">
        <div><label className="label">현재 비밀번호</label>
          <input type="password" className="admin-input" value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" /></div>
        <div><label className="label">새 비밀번호 (8자 이상)</label>
          <input type="password" className="admin-input" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" /></div>
        <div><label className="label">새 비밀번호 확인</label>
          <input type="password" className="admin-input" value={next2} onChange={(e) => setNext2(e.target.value)} autoComplete="new-password" /></div>
        {msg && <p className={`text-sm font-medium ${ok ? 'text-green-600' : 'text-red-500'}`} role="alert">{msg}</p>}
        <button className="admin-btn admin-btn-primary w-full !py-3">비밀번호 변경</button>
      </form>
      <p className="text-xs text-gray-400">
        초기 비밀번호는 .env 파일의 ADMIN_INITIAL_PASSWORD 값입니다. 보안을 위해 최초 로그인 후 반드시 변경하세요.
      </p>
    </div>
  );
}
