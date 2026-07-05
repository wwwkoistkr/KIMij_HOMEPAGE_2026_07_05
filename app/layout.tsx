// 루트 레이아웃: 테마 CSS 변수 주입(관리자 설정 반영) + SEO 메타 + JSON-LD
import './globals.css';
import type { Metadata } from 'next';
import { getSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = `${s.companyName} | 인허가·비자·법인설립 행정 전문`;
  const description = s.heroSubtitle;
  return {
    title,
    description,
    openGraph: { title, description, type: 'website', locale: 'ko_KR' },
    twitter: { card: 'summary_large_image', title, description },
    robots: { index: true, follow: true }
    // 네이버 서치어드바이저 / 구글 서치콘솔 인증 메타는 아래 verification에 추가
    // verification: { google: '...', other: { 'naver-site-verification': '...' } }
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const t = s.theme;
  const themeCss = `:root{
--color-navy-900:${t.navy900};--color-navy-800:${t.navy800};--color-navy-700:${t.navy700};
--color-navy-600:${t.navy600};--color-primary:${t.primary};--color-accent:${t.accent};
--color-ink:${t.ink};--color-line:${t.line};--color-bg:${t.bg};--color-bg-soft:${t.bgSoft};}
body{font-family:'Pretendard Variable',Pretendard,'Noto Sans KR',system-ui,-apple-system,'Segoe UI',sans-serif;}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: s.companyName,
    telephone: s.phone,
    email: s.email,
    address: { '@type': 'PostalAddress', streetAddress: s.address, addressCountry: 'KR' },
    openingHours: s.businessHours
  };

  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
