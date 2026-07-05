'use client';
// 관리자 사이드바 (모바일: 상단 가로 스크롤 탭)
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const MENU = [
  { href: '/admin', label: '대시보드', icon: '📊' },
  { href: '/admin/inquiries', label: '상담문의', icon: '📮' },
  { href: '/admin/services', label: '서비스 관리', icon: '🗂️' },
  { href: '/admin/posts', label: '자료실 관리', icon: '📰' },
  { href: '/admin/settings', label: '사이트 설정', icon: '🎨' },
  { href: '/admin/account', label: '계정 설정', icon: '🔐' }
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  return (
    <aside className="lg:w-60 shrink-0 bg-[var(--color-navy-900)] text-white flex flex-col">
      <div className="p-5 font-extrabold text-lg border-b border-white/10 hidden lg:block">
        KNS 관리자
      </div>
      <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible" aria-label="관리자 메뉴">
        {MENU.map((m) => {
          const active = m.href === '/admin' ? pathname === '/admin' : pathname.startsWith(m.href);
          return (
            <Link key={m.href} href={m.href}
              className={`px-5 py-3.5 whitespace-nowrap text-sm font-medium transition-colors ${
                active ? 'bg-[var(--color-primary)] text-white' : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}>
              <span className="mr-2" aria-hidden="true">{m.icon}</span>{m.label}
            </Link>
          );
        })}
      </nav>
      <div className="lg:mt-auto p-5 border-t border-white/10 flex lg:flex-col gap-4 lg:gap-2 text-sm">
        <Link href="/" target="_blank" className="text-white/70 hover:text-white">↗ 사이트 보기</Link>
        <button onClick={logout} className="text-left text-white/70 hover:text-white">⏻ 로그아웃</button>
      </div>
    </aside>
  );
}
