'use client';
// 우하단 플로팅 버튼: 전화 · 카카오 · 상담문의
import Link from 'next/link';

export default function Floating({ phone, kakaoUrl }: { phone: string; kakaoUrl: string }) {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2.5">
      <a
        href={`tel:${phone.replace(/-/g, '')}`}
        aria-label="전화 상담"
        className="w-13 h-13 rounded-full bg-[var(--color-primary)] text-white shadow-hover flex items-center justify-center hover:scale-110 transition-transform"
        style={{ width: 52, height: 52 }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/>
        </svg>
      </a>
      {kakaoUrl && (
        <a
          href={kakaoUrl} target="_blank" rel="noopener noreferrer" aria-label="카카오톡 상담"
          className="rounded-full shadow-hover flex items-center justify-center hover:scale-110 transition-transform font-extrabold"
          style={{ width: 52, height: 52, background: '#FEE500', color: '#191919' }}
        >
          톡
        </a>
      )}
      <Link
        href="/#contact" aria-label="상담 신청"
        className="rounded-full bg-[var(--color-accent)] text-[var(--color-navy-900)] shadow-hover flex items-center justify-center hover:scale-110 transition-transform"
        style={{ width: 52, height: 52 }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM7 9h10v2H7V9zm6 5H7v-2h6v2zm4-6H7V6h10v2z"/>
        </svg>
      </Link>
    </div>
  );
}
