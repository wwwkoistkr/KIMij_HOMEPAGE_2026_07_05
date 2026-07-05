'use client';
// 관리자 로그인
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    setLoading(false);
    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setError((await res.json()).error || '로그인에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-navy-900)] px-4">
      <form onSubmit={submit} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <svg width="48" height="48" viewBox="0 0 40 40" className="mx-auto mb-3" aria-hidden="true">
            <rect x="2" y="2" width="36" height="36" rx="9" fill="var(--color-accent)" />
            <text x="20" y="27" textAnchor="middle" fontSize="16" fontWeight="800" fill="var(--color-navy-900)">KS</text>
          </svg>
          <h1 className="font-extrabold text-xl">관리자 로그인</h1>
          <p className="text-sm text-gray-500 mt-1">케이앤에스 글로벌 행정사무소</p>
        </div>
        <label className="label" htmlFor="lg-u">아이디</label>
        <input id="lg-u" className="admin-input mb-4" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        <label className="label" htmlFor="lg-p">비밀번호</label>
        <input id="lg-p" type="password" className="admin-input mb-5" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        {error && <p className="text-red-500 text-sm mb-4" role="alert">{error}</p>}
        <button className="admin-btn admin-btn-primary w-full !py-3" disabled={loading}>
          {loading ? '확인 중…' : '로그인'}
        </button>
        <p className="text-xs text-gray-400 mt-4 text-center">로그인 5회 실패 시 15분간 잠깁니다.</p>
      </form>
    </div>
  );
}
