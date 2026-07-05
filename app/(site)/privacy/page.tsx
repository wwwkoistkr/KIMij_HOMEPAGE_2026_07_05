// 개인정보처리방침 (개인정보보호법 준수)
import { getSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata = { title: '개인정보처리방침 | 케이앤에스 글로벌 행정사무소' };

export default async function PrivacyPage() {
  const s = await getSettings();
  return (
    <>
      <section className="bg-[var(--color-navy-900)] text-white pt-32 lg:pt-40 pb-14">
        <div className="container-max px-6 lg:px-10">
          <h1 className="h-sec">개인정보처리방침</h1>
        </div>
      </section>
      <section className="bg-[var(--color-bg)] section-pad">
        <div className="container-max max-w-4xl space-y-8 leading-loose">
          <p>
            {s.companyName}(이하 &lsquo;사무소&rsquo;)는 「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를
            보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을
            수립·공개합니다.
          </p>
          <Sec n="1" t="개인정보의 처리 목적">
            사무소는 상담 문의 응대 및 회신, 행정업무 대행 서비스 제공을 목적으로 개인정보를 처리합니다.
            처리한 개인정보는 명시한 목적 이외의 용도로 이용하지 않으며, 이용 목적이 변경되는 경우에는
            「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행합니다.
          </Sec>
          <Sec n="2" t="처리하는 개인정보의 항목">
            상담 문의: 이름, 연락처(필수) / 이메일(선택) / 문의 내용. 서비스 이용 과정에서 접속 IP,
            접속 기록이 자동으로 생성·수집될 수 있습니다.
          </Sec>
          <Sec n="3" t="개인정보의 처리 및 보유 기간">
            상담 문의 정보는 상담 완료 후 1년간 보유 후 지체 없이 파기합니다. 다만 관계 법령에 따라
            보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보존합니다.
          </Sec>
          <Sec n="4" t="개인정보의 제3자 제공">
            사무소는 정보주체의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는
            경우에만 개인정보를 제3자에게 제공합니다. 그 외에는 제3자에게 제공하지 않습니다.
          </Sec>
          <Sec n="5" t="개인정보 처리의 위탁">
            사무소는 원활한 서비스 제공을 위해 홈페이지 운영·관리(호스팅), 문의 접수 처리(구글 스프레드시트·메일 발송)
            업무를 위탁할 수 있으며, 위탁 시 관련 법령에 따라 안전하게 관리되도록 필요한 사항을 규정합니다.
          </Sec>
          <Sec n="6" t="정보주체의 권리·의무 및 행사 방법">
            정보주체는 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.
            권리 행사는 전화({s.phone}) 또는 이메일({s.email})로 하실 수 있으며, 사무소는 지체 없이 조치합니다.
          </Sec>
          <Sec n="7" t="개인정보의 파기">
            보유 기간이 경과하거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다. 전자적 파일은 복구할 수
            없는 방법으로 삭제하고, 종이 문서는 분쇄하거나 소각합니다.
          </Sec>
          <Sec n="8" t="개인정보의 안전성 확보 조치">
            사무소는 개인정보의 안전성 확보를 위해 관리자 인증(비밀번호 암호화 저장), 접근 통제,
            접속 기록 보관 등의 조치를 취하고 있습니다.
          </Sec>
          <Sec n="9" t="개인정보 보호책임자">
            성명: {s.ceoName || '대표 행정사'} / 연락처: {s.phone} / 이메일: {s.email}
            <br />정보주체는 개인정보 침해에 대한 신고·상담이 필요한 경우 개인정보침해신고센터(privacy.kisa.or.kr,
            국번 없이 118)에 문의하실 수 있습니다.
          </Sec>
          <p className="text-sm text-[var(--color-ink)]/50">본 방침은 2026년 7월 2일부터 시행됩니다.</p>
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
