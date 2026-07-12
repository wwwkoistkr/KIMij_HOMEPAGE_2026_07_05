'use client';
// 상담문의 폼: 검증 → /api/inquiries POST → 토스트
import { useState } from 'react';

const CATEGORIES = ['인허가', '비자·체류', '귀화·국적', '법인설립', '각종 신고', '행정심판', '기타'];

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', category: CATEGORIES[0], message: '', agree: false, website: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = '이름을 입력해 주세요.';
    if (!/^[0-9-]{9,13}$/.test(form.phone.trim())) e.phone = '연락처를 숫자와 하이픈으로 입력해 주세요.';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = '이메일 형식이 올바르지 않습니다.';
    if (form.message.trim().length < 10) e.message = '문의 내용을 10자 이상 입력해 주세요.';
    if (!form.agree) e.agree = '개인정보 수집·이용에 동의해 주세요.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error((await res.json()).error || '접수에 실패했습니다.');
      setToast('상담문의가 접수되었습니다. 빠르게 연락드리겠습니다.');
      setForm({ name: '', phone: '', email: '', category: CATEGORIES[0], message: '', agree: false, website: '' });
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      setToast(err instanceof Error ? err.message : '오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      setTimeout(() => setToast(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="cf-name">이름 <span className="text-red-500">*</span></label>
          <input id="cf-name" className="field" value={form.name} onChange={(e) => set('name', e.target.value)}
            placeholder="김일준" aria-invalid={!!errors.name} />
          {errors.name && <p className="text-red-500 text-sm mt-1" role="alert">{errors.name}</p>}
        </div>
        <div>
          <label className="label" htmlFor="cf-phone">연락처 <span className="text-red-500">*</span></label>
          <input id="cf-phone" className="field" value={form.phone} onChange={(e) => set('phone', e.target.value)}
            placeholder="010-3547-1860" inputMode="tel" aria-invalid={!!errors.phone} />
          {errors.phone && <p className="text-red-500 text-sm mt-1" role="alert">{errors.phone}</p>}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="cf-email">이메일 (선택)</label>
          <input id="cf-email" className="field" type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
            placeholder="ijkim4756@gmail.com" aria-invalid={!!errors.email} />
          {errors.email && <p className="text-red-500 text-sm mt-1" role="alert">{errors.email}</p>}
        </div>
        <div>
          <label className="label" htmlFor="cf-cat">문의 분야</label>
          <select id="cf-cat" className="field" value={form.category} onChange={(e) => set('category', e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="cf-msg">문의 내용 <span className="text-red-500">*</span></label>
        <textarea id="cf-msg" className="field min-h-[130px]" value={form.message} onChange={(e) => set('message', e.target.value)}
          placeholder="문의할 내용을 입력하세요. (예: 외국인 근로자 고용허가 절차와 필요 서류가 궁금합니다.)" aria-invalid={!!errors.message} />
        {errors.message && <p className="text-red-500 text-sm mt-1" role="alert">{errors.message}</p>}
      </div>

      {/* 허니팟 (스팸 방지 - 사람에게는 보이지 않음) */}
      <input type="text" name="website" value={form.website} onChange={(e) => set('website', e.target.value)}
        className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="rounded-xl bg-[var(--color-bg-soft)] border border-[var(--color-line)] p-4 text-sm">
        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" checked={form.agree} onChange={(e) => set('agree', e.target.checked)} className="mt-1" />
          <span>
            <b>[필수] 개인정보 수집·이용 동의</b><br />
            수집 항목: 이름, 연락처, 이메일(선택), 문의 내용 · 목적: 상담 응대 및 회신 · 보유 기간: 상담 완료 후 1년(관계 법령에 따름).
            동의를 거부할 수 있으며, 거부 시 온라인 상담 접수가 제한됩니다. 자세한 내용은 개인정보처리방침을 확인해 주세요.
          </span>
        </label>
        {errors.agree && <p className="text-red-500 mt-2" role="alert">{errors.agree}</p>}
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary w-full sm:w-auto disabled:opacity-60">
        {loading ? '접수 중…' : '문의 접수하기'}
      </button>

      {toast && <div className="toast" role="status">{toast}</div>}
    </form>
  );
}
