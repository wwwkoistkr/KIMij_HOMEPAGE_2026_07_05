// 이용약관
import { getSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata = { title: '이용약관 | 케이앤에스 글로벌 행정사무소' };

export default async function TermsPage() {
  const s = await getSettings();
  return (
    <>
      <section className="bg-[var(--color-navy-900)] text-white pt-32 lg:pt-40 pb-14">
        <div className="container-max px-6 lg:px-10">
          <h1 className="h-sec">이용약관</h1>
        </div>
      </section>
      <section className="bg-[var(--color-bg)] section-pad">
        <div className="container-max max-w-4xl space-y-8 leading-loose">
          <Sec n="1" t="목적">
            본 약관은 {s.companyName}(이하 &lsquo;사무소&rsquo;)가 운영하는 홈페이지에서 제공하는 서비스의 이용
            조건 및 절차, 이용자와 사무소의 권리·의무·책임 사항을 규정함을 목적으로 합니다.
          </Sec>
          <Sec n="2" t="서비스의 내용">
            홈페이지는 행정업무 안내, 자료 제공, 온라인 상담 접수 서비스를 제공합니다. 홈페이지에 게시된 정보는
            일반적인 안내이며, 개별 사안에 대한 법률 자문을 대신하지 않습니다.
          </Sec>
          <Sec n="3" t="상담 접수">
            온라인 상담 접수는 정식 위임계약이 아니며, 사무소의 회신 및 상호 협의 후 업무가 개시됩니다.
            허위 정보 기재로 인한 불이익은 이용자에게 있습니다.
          </Sec>
          <Sec n="4" t="저작권">
            홈페이지의 모든 콘텐츠(글·이미지·디자인)의 저작권은 사무소에 있으며, 사전 동의 없는 무단 복제·배포를
            금합니다.
          </Sec>
          <Sec n="5" t="면책">
            사무소는 천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.
            홈페이지 정보의 이용으로 발생한 결과에 대한 최종 판단과 책임은 이용자에게 있습니다.
          </Sec>
          <Sec n="6" t="분쟁 해결">
            서비스 이용과 관련한 분쟁은 상호 협의로 해결하며, 협의가 이루어지지 않을 경우 관할 법원에 제소할 수
            있습니다.
          </Sec>
          <p className="text-sm text-[var(--color-ink)]/50">본 약관은 2026년 7월 2일부터 시행됩니다.</p>
        </div>
      </section>
    </>
  );
}

function Sec({ n, t, children }: { n: string; t: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="h-card mb-2">제{n}조 ({t})</h2>
      <p className="text-[var(--color-ink)]/80">{children}</p>
    </div>
  );
}
