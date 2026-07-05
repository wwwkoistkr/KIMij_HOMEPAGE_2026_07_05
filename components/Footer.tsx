// 하단 푸터: 사업자정보 · 법적고지 · 정책 링크
import Link from 'next/link';
import type { Settings } from '@/lib/db';

export default function Footer({ s }: { s: Settings }) {
  return (
    <footer className="bg-[var(--color-navy-900)] text-white/70">
      <div className="container-max px-6 lg:px-10 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <p className="text-white font-extrabold text-lg mb-3">{s.companyName}</p>
          <ul className="space-y-1.5 text-sm leading-relaxed">
            {s.ceoName && <li>대표: {s.ceoName}</li>}
            <li>주소: {s.address}</li>
            <li>전화: <a href={`tel:${s.phone.replace(/-/g, '')}`} className="hover:text-white">{s.phone}</a></li>
            <li>이메일: <a href={`mailto:${s.email}`} className="hover:text-white">{s.email}</a></li>
            {s.bizRegNo && <li>사업자등록번호: {s.bizRegNo}</li>}
            <li>영업시간: {s.businessHours}</li>
          </ul>
        </div>
        <div>
          <p className="text-white font-bold mb-3">바로가기</p>
          <ul className="space-y-1.5 text-sm">
            <li><Link href="/#about" className="hover:text-white">사무소소개</Link></li>
            <li><Link href="/#services" className="hover:text-white">서비스안내</Link></li>
            <li><Link href="/notice" className="hover:text-white">공지사항</Link></li>
            <li><Link href="/blog" className="hover:text-white">블로그·자료실</Link></li>
            <li><Link href="/#contact" className="hover:text-white">상담문의</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-white font-bold mb-3">법적 고지</p>
          <p className="text-xs leading-relaxed text-white/50">
            본 홈페이지의 내용은 일반적인 행정 정보 제공을 목적으로 하며, 개별 사안에 대한 법률 자문을 대신하지
            않습니다. 구체적인 사안은 반드시 상담을 통해 확인하시기 바랍니다. 본 사이트의 모든 콘텐츠는 저작권법의
            보호를 받습니다.
          </p>
          <div className="flex gap-4 mt-4 text-sm">
            <Link href="/privacy" className="underline hover:text-white">개인정보처리방침</Link>
            <Link href="/terms" className="underline hover:text-white">이용약관</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {s.companyName}. All rights reserved.
      </div>
    </footer>
  );
}
