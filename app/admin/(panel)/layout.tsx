// 관리자 콘솔 레이아웃 (인증은 middleware가 보호)
import Sidebar from '@/components/admin/Sidebar';

export const dynamic = 'force-dynamic';
export const metadata = { title: '관리자 콘솔 | 케이앤에스 글로벌 행정사무소', robots: { index: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--color-bg-soft)]">
      <Sidebar />
      <div className="flex-1 p-4 lg:p-8 max-w-[1400px]">{children}</div>
    </div>
  );
}
