'use client';
// 상단 고정 헤더: 스크롤 시 배경 전환, 모바일 햄버거 메뉴
import { useEffect, useState } from 'react';
import Link from 'next/link';

const NAV = [
  { href: '/#about', label: '사무소소개' },
  { href: '/#services', label: '서비스안내' },
  { href: '/#process', label: '진행절차' },
  { href: '/#notice', label: '자료실' },
  { href: '/#contact', label: '상담문의' }
];

export default function Header({ companyName, phone }: { companyName: string; phone: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[var(--color-navy-900)]/95 shadow-lg backdrop-blur' : 'bg-[var(--color-navy-900)]/40 backdrop-blur-sm'
      }`}
    >
      <a href="#main" className="skip-link">본문 바로가기</a>
      <div className="container-max flex items-center justify-between px-4 lg:px-8 h-16 lg:h-20">
        <Link href="/" className="flex items-center gap-2 text-white font-extrabold text-lg lg:text-xl tracking-tight">
          {/* 로고 (SVG - 어떤 해상도에서도 선명) */}
          <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
            <rect x="2" y="2" width="36" height="36" rx="9" fill="var(--color-accent)" />
            <text x="20" y="27" textAnchor="middle" fontSize="16" fontWeight="800" fill="var(--color-navy-900)">KS</text>
          </svg>
          <span>{companyName}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8" aria-label="주 메뉴">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-white/85 hover:text-white font-medium transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a href={`tel:${phone.replace(/-/g, '')}`} className="text-white font-bold tracking-wide">
            📞 {phone}
          </a>
          <Link href="/#contact" className="btn btn-accent !py-2.5 !px-5 text-sm">상담문의</Link>
        </div>

        <button
          className="lg:hidden text-white p-2"
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {open && (
        <nav className="lg:hidden bg-[var(--color-navy-900)] border-t border-white/10 px-6 py-4 flex flex-col gap-1" aria-label="모바일 메뉴">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
              className="text-white/90 py-3 border-b border-white/5 font-medium">
              {n.label}
            </Link>
          ))}
          <a href={`tel:${phone.replace(/-/g, '')}`} className="text-[var(--color-accent)] py-3 font-bold">📞 {phone}</a>
        </nav>
      )}
    </header>
  );
}
