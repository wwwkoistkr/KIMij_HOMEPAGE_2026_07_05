'use client';
// 사이트 설정: 회사정보 · 히어로 문구/이미지 · 테마 컬러 · 성과 지표 (전면 관리)
import { useEffect, useState } from 'react';

type Theme = Record<string, string>;
type Stat = { label: string; value: number; suffix: string };
type Settings = {
  companyName: string; ceoName: string; phone: string; address: string; email: string;
  bizRegNo: string; businessHours: string; kakaoUrl: string; greeting: string;
  heroBadge: string; heroTitle: string; heroSubtitle: string; heroImageUrl: string;
  heroPortraitUrl: string;
  theme: Theme; stats: Stat[];
};

const COLOR_FIELDS: { key: string; label: string }[] = [
  { key: 'primary', label: '메인 컬러 (버튼·강조)' },
  { key: 'accent', label: '포인트 컬러 (골드)' },
  { key: 'navy900', label: '다크 배경 (히어로·푸터)' },
  { key: 'navy800', label: '다크 배경 2 (통계 등)' },
  { key: 'navy600', label: '버튼 호버' },
  { key: 'ink', label: '본문 글자색' },
  { key: 'bg', label: '기본 배경' },
  { key: 'bgSoft', label: '연한 배경 (교차 섹션)' },
  { key: 'line', label: '구분선' }
];

export default function SettingsAdmin() {
  const [s, setS] = useState<Settings | null>(null);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then(setS);
  }, []);

  if (!s) return <p className="text-gray-400 py-20 text-center">불러오는 중…</p>;

  const set = (k: keyof Settings, v: unknown) => setS({ ...s, [k]: v } as Settings);
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3500); };

  const save = async () => {
    setSaving(true);
    const res = await fetch('/api/settings', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s)
    });
    setSaving(false);
    flash(res.ok ? '저장되었습니다. 공개 사이트 전체에 바로 반영됩니다.' : '저장에 실패했습니다.');
  };

  const uploadTo = (field: 'heroImageUrl' | 'heroPortraitUrl') =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) set(field, (await res.json()).url);
      else flash((await res.json()).error || '업로드 실패');
      e.target.value = '';
    };
  const uploadHero = uploadTo('heroImageUrl');
  const uploadPortrait = uploadTo('heroPortraitUrl');
  const heroIsVideo = /\.(mp4|webm)$/i.test(s.heroImageUrl || '');

  return (
    <div className="space-y-6 pb-24">
      <h1 className="text-2xl font-extrabold">사이트 설정</h1>

      <Card title="회사 정보 (헤더·푸터·연락처 전역 반영)">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="상호" v={s.companyName} on={(v) => set('companyName', v)} />
          <Field label="대표자명" v={s.ceoName} on={(v) => set('ceoName', v)} />
          <Field label="대표 연락처" v={s.phone} on={(v) => set('phone', v)} />
          <Field label="이메일" v={s.email} on={(v) => set('email', v)} />
          <Field label="주소" v={s.address} on={(v) => set('address', v)} />
          <Field label="사업자등록번호" v={s.bizRegNo} on={(v) => set('bizRegNo', v)} />
          <Field label="영업시간" v={s.businessHours} on={(v) => set('businessHours', v)} />
          <Field label="카카오채널 URL" v={s.kakaoUrl} on={(v) => set('kakaoUrl', v)} />
        </div>
        <label className="label mt-4">대표 인사말 (소개 섹션)</label>
        <textarea className="admin-input min-h-[110px]" value={s.greeting} onChange={(e) => set('greeting', e.target.value)} />
      </Card>

      <Card title="메인 화면 문구·이미지 (히어로)">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="상단 배지 문구" v={s.heroBadge} on={(v) => set('heroBadge', v)} />
          <Field label="부제목" v={s.heroSubtitle} on={(v) => set('heroSubtitle', v)} />
        </div>
        <label className="label mt-4">메인 제목 (줄바꿈 가능)</label>
        <textarea className="admin-input min-h-[70px]" value={s.heroTitle} onChange={(e) => set('heroTitle', e.target.value)} />
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <label className="admin-btn admin-btn-ghost cursor-pointer">
            🖼 히어로 배경 이미지/영상 업로드 (mp4·webm 가능, 최대 50MB)
            <input type="file" accept="image/*,video/mp4,video/webm" className="hidden" onChange={uploadHero} />
          </label>
          {s.heroImageUrl && (
            <>
              {heroIsVideo ? (
                <video src={s.heroImageUrl} muted loop autoPlay playsInline className="h-16 rounded border" />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={s.heroImageUrl} alt="히어로 배경" className="h-16 rounded border" />
              )}
              <button className="admin-btn admin-btn-danger" onClick={() => set('heroImageUrl', '')}>제거 (기본 이미지 사용)</button>
            </>
          )}
        </div>
        <div className="mt-4 flex items-center gap-3 flex-wrap border-t border-[var(--color-line)] pt-4">
          <label className="admin-btn admin-btn-ghost cursor-pointer">
            👤 대표(프로필) 사진 업로드 — 히어로 우측에 표시
            <input type="file" accept="image/*" className="hidden" onChange={uploadPortrait} />
          </label>
          {s.heroPortraitUrl && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.heroPortraitUrl} alt="대표 사진" className="h-16 rounded border" />
              <button className="admin-btn admin-btn-danger" onClick={() => set('heroPortraitUrl', '')}>사진 제거 (히어로에서 숨김)</button>
            </>
          )}
        </div>
      </Card>

      <Card title="테마 컬러 (홈페이지 전면 색상)">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COLOR_FIELDS.map((f) => (
            <div key={f.key} className="flex items-center gap-3">
              <input type="color" value={s.theme[f.key] || '#000000'}
                onChange={(e) => set('theme', { ...s.theme, [f.key]: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer border border-[var(--color-line)]"
                aria-label={f.label} />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{f.label}</p>
                <p className="text-xs text-gray-400">{s.theme[f.key]}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">저장 후 공개 사이트를 새로고침하면 전체 색상이 즉시 바뀝니다.</p>
      </Card>

      <Card title="성과 지표 (숫자 카운트업)">
        {s.stats.map((st, i) => (
          <div key={i} className="flex gap-2 mb-2 items-center">
            <input className="admin-input !w-40" placeholder="이름" value={st.label}
              onChange={(e) => set('stats', s.stats.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
            <input className="admin-input !w-28" type="number" placeholder="숫자" value={st.value}
              onChange={(e) => set('stats', s.stats.map((x, j) => j === i ? { ...x, value: Number(e.target.value) } : x))} />
            <input className="admin-input !w-20" placeholder="단위" value={st.suffix}
              onChange={(e) => set('stats', s.stats.map((x, j) => j === i ? { ...x, suffix: e.target.value } : x))} />
            <button className="admin-btn admin-btn-danger" onClick={() => set('stats', s.stats.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
        <button className="admin-btn admin-btn-ghost" onClick={() => set('stats', [...s.stats, { label: '', value: 0, suffix: '' }])}>＋ 지표 추가</button>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 lg:left-60 bg-white/90 backdrop-blur border-t border-[var(--color-line)] p-4 flex items-center gap-4 z-40">
        <button className="admin-btn admin-btn-primary !px-8 !py-3" onClick={save} disabled={saving}>
          {saving ? '저장 중…' : '전체 저장'}
        </button>
        {msg && <p className="text-sm font-medium text-[var(--color-primary)]">{msg}</p>}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-line)] p-5">
      <h2 className="font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}

