// 공개 사이트 레이아웃: 헤더 + 본문 + 푸터 + 플로팅 버튼
import { getSettings } from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Floating from '@/components/Floating';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <>
      <Header companyName={s.companyName} phone={s.phone} />
      <main id="main">{children}</main>
      <Footer s={s} />
      <Floating phone={s.phone} kakaoUrl={s.kakaoUrl} />
    </>
  );
}
