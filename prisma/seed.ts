// 시드 데이터: 관리자 계정 + 회사정보 + 업종 표준 서비스/자료실 콘텐츠
// (블로그 확정 문구 확보 전 표준안 - 관리자 모드에서 자유롭게 교체 가능)
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const proc = (steps: string[]) => JSON.stringify(steps);
const faq = (items: { q: string; a: string }[]) => JSON.stringify(items);

async function main() {
  // 1) 관리자 계정
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_INITIAL_PASSWORD || 'kns2026!admin';
  await prisma.adminUser.upsert({
    where: { username },
    update: {},
    create: { username, passwordHash: await bcrypt.hash(password, 10) }
  });

  // 2) 회사정보 + 테마 + 성과지표
  await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      companyName: '케이앤에스 글로벌 행정사무소',
      phone: '010-3547-1860',
      address: '경기도 안양시 만안구 삼덕로 42',
      email: 'ijkim4756@naver.com',
      businessHours: '평일 09:00 ~ 18:00 (주말·공휴일 사전예약)',
      greeting:
        '안녕하십니까. 케이앤에스 글로벌 행정사무소 대표 행정사입니다.\n' +
        '행정사는 여러분의 심부름 전담부서입니다. 복잡한 인허가와 외국인 비자·체류, 법인 설립, 각종 신고 업무를 ' +
        '의뢰인의 입장에서 가장 빠르고 정확하게 처리해 드리겠습니다. 작은 서류 하나도 소홀히 하지 않는 것이 저희의 약속입니다.',
      heroBadge: '믿을 수 있는 행정 파트너',
      heroTitle: '복잡한 행정,\n케이앤에스가 대신합니다',
      heroSubtitle: '인허가 · 외국인 비자·체류 · 법인설립 · 각종 신고를 한 번에 해결하는 검증된 글로벌 행정 파트너',
      themeJson: '{}',
      statsJson: JSON.stringify([
        { label: '누적 상담', value: 3200, suffix: '+' },
        { label: '처리 완료', value: 2400, suffix: '건' },
        { label: '업무 경력', value: 15, suffix: '년' },
        { label: '상담 만족도', value: 98, suffix: '%' }
      ])
    }
  });

  // 3) 서비스 카테고리 + 서비스 (글로벌 업무 상단 배치)
  const existing = await prisma.serviceCategory.count();
  if (existing === 0) {
    const catGlobal = await prisma.serviceCategory.create({ data: { name: '외국인·국제 업무', sortOrder: 0 } });
    const catLicense = await prisma.serviceCategory.create({ data: { name: '인허가·신고', sortOrder: 1 } });
    const catBiz = await prisma.serviceCategory.create({ data: { name: '법인·사업 지원', sortOrder: 2 } });
    const catCivil = await prisma.serviceCategory.create({ data: { name: '권리구제·서류작성', sortOrder: 3 } });

    await prisma.service.createMany({
      data: [
        {
          categoryId: catGlobal.id, sortOrder: 0, title: '외국인 비자·체류', slug: 'visa', icon: '🛂',
          summary: '비자 발급·연장·변경, 체류자격 관리를 원스톱으로 대행합니다.',
          overview: '외국인등록, 체류자격 변경·연장, 각종 비자(E-7, F-2, F-5, F-6, D-8 등) 신청을 출입국·외국인청 실무 경험을 바탕으로 정확하게 대행합니다.',
          target: '국내 체류 외국인, 외국인 근로자를 고용하려는 기업, 결혼이민·유학·투자 목적 체류자',
          documents: '여권 사본, 외국인등록증, 체류자격별 입증서류(고용계약서·재직증명·소득자료 등), 신원보증 서류',
          processJson: proc(['무료 상담·체류자격 진단', '요건 검토 및 서류 안내', '신청서 작성·접수 대행', '출입국청 심사 대응', '허가 수령·사후 안내']),
          priceInfo: '업무 난이도에 따라 상담 후 안내 (기본 수수료 + 실비)',
          faqJson: faq([
            { q: '체류기간이 임박했는데 연장 가능한가요?', a: '만료 4개월 전부터 신청 가능하며, 임박한 경우에도 신속 접수를 도와드립니다. 가급적 빨리 상담을 요청해 주세요.' },
            { q: '방문 없이 진행할 수 있나요?', a: '전자민원 및 대행 접수가 가능한 업무는 방문 없이 처리됩니다. 필요 시 1회 방문으로 마무리되도록 준비해 드립니다.' }
          ])
        },
        {
          categoryId: catGlobal.id, sortOrder: 1, title: '외국인 초청·사증발급인정', slug: 'invitation', icon: '✉️',
          summary: '가족·근로자·연수생 초청과 사증발급인정서 신청을 대행합니다.',
          overview: '해외 가족이나 근로자를 국내로 초청하기 위한 사증발급인정서 신청, 초청장 및 신원보증 서류 작성을 지원합니다.',
          target: '해외 가족을 초청하려는 국민·등록외국인, 외국 인력을 채용하려는 기업',
          documents: '초청자 신분증명, 가족관계 입증서류, 재정입증 서류, 피초청자 여권 사본',
          processJson: proc(['상담·초청 요건 확인', '서류 준비 안내', '사증발급인정서 신청', '심사 대응', '인정서 발급·현지 비자 신청 안내']),
          priceInfo: '상담 후 안내',
          faqJson: faq([{ q: '초청까지 얼마나 걸리나요?', a: '통상 접수 후 2~4주가 소요되며, 자격·심사 상황에 따라 달라질 수 있습니다.' }])
        },
        {
          categoryId: catGlobal.id, sortOrder: 2, title: '귀화·국적 취득', slug: 'naturalization', icon: '🇰🇷',
          summary: '일반·간이·특별귀화 및 국적회복 절차를 전문적으로 지원합니다.',
          overview: '귀화 요건 진단부터 서류 준비, 접수, 면접 대비까지 국적 취득 전 과정을 함께합니다.',
          target: '장기 체류 외국인, 결혼이민자, 국적회복 대상자',
          documents: '여권·외국인등록증, 범죄경력증명, 소득·재산 입증, 가족관계 서류, 한국어능력 입증',
          processJson: proc(['요건 진단 상담', '서류 수집·번역 공증', '귀화 신청 접수', '면접·심사 대비', '국적 취득·후속 절차']),
          priceInfo: '상담 후 안내',
          faqJson: faq([{ q: '귀화 심사 기간은 얼마나 되나요?', a: '유형에 따라 다르나 통상 1년 내외가 소요됩니다. 서류 완성도가 기간 단축의 핵심입니다.' }])
        },
        {
          categoryId: catLicense.id, sortOrder: 0, title: '영업 인허가', slug: 'business-license', icon: '📑',
          summary: '식품·위생·건설·운송 등 각종 영업 인허가를 신속하게 대행합니다.',
          overview: '일반음식점, 휴게음식점, 식품제조가공업, 건설업 등록 등 사업 개시에 필요한 인허가 절차를 대행합니다.',
          target: '신규 창업자, 업종 변경·확장 사업자',
          documents: '사업자등록증, 임대차계약서, 시설 도면, 위생교육 수료증 등 업종별 서류',
          processJson: proc(['업종·입지 검토', '요건·시설 기준 확인', '신청서 작성·접수', '현장 실사 대응', '허가증 수령']),
          priceInfo: '업종별 상이, 상담 후 안내',
          faqJson: faq([{ q: '입지가 허가 요건에 맞는지 먼저 알 수 있나요?', a: '네. 계약 전 입지·용도 검토를 먼저 해드립니다. 계약 후 불허 사례를 예방하는 가장 중요한 단계입니다.' }])
        },
        {
          categoryId: catLicense.id, sortOrder: 1, title: '각종 신고·등록 대행', slug: 'report', icon: '🗂️',
          summary: '통신판매업, 학원, 공장설립 등 각종 신고·등록을 대행합니다.',
          overview: '행정기관에 제출하는 각종 신고·등록·신청 서류를 정확하게 작성하고 접수를 대행합니다.',
          target: '온라인 판매자, 교육사업자, 제조업체 등',
          documents: '신분증, 사업자등록증, 업종별 요건 서류',
          processJson: proc(['상담·요건 확인', '서류 작성', '접수 대행', '수리·등록 확인']),
          priceInfo: '건별 상담 후 안내',
          faqJson: faq([])
        },
        {
          categoryId: catBiz.id, sortOrder: 0, title: '법인·사업자 설립', slug: 'incorporation', icon: '🏢',
          summary: '내국인·외국인 투자 법인 설립과 사업자 등록을 지원합니다.',
          overview: '주식회사 설립, 외국인투자기업(FDI) 등록, 사업자등록까지 창업 행정을 원스톱으로 지원합니다.',
          target: '창업 예정자, 국내 진출 외국 기업·투자자',
          documents: '발기인·임원 신분증명, 자본금 납입 증명, 사무소 임대차계약서, (외투) 투자 입증서류',
          processJson: proc(['설립 구조 상담', '정관·서류 작성', '설립 등기 연계', '사업자등록·인허가', '외투 등록(해당 시)']),
          priceInfo: '상담 후 안내',
          faqJson: faq([{ q: '외국인도 국내 법인을 만들 수 있나요?', a: '가능합니다. 외국인투자촉진법에 따른 절차와 체류자격(D-8 등)까지 함께 설계해 드립니다.' }])
        },
        {
          categoryId: catBiz.id, sortOrder: 1, title: '정부지원·기업인증', slug: 'certification', icon: '🏅',
          summary: '벤처기업·이노비즈 등 기업 인증과 정부지원사업 신청을 돕습니다.',
          overview: '벤처기업 확인, 이노비즈·메인비즈 인증, 각종 정부지원사업 신청서 작성을 지원합니다.',
          target: '중소기업, 스타트업',
          documents: '재무제표, 사업계획서, 기술 관련 입증자료',
          processJson: proc(['기업 진단', '적합 인증·사업 매칭', '신청서·증빙 준비', '접수·심사 대응', '인증 취득']),
          priceInfo: '상담 후 안내',
          faqJson: faq([])
        },
        {
          categoryId: catCivil.id, sortOrder: 0, title: '행정심판·이의신청', slug: 'appeal', icon: '⚖️',
          summary: '영업정지·과징금 등 부당한 행정처분에 대한 구제 절차를 대리합니다.',
          overview: '행정처분에 불복하는 행정심판 청구, 이의신청, 탄원서·의견서 작성을 통해 권리 구제를 돕습니다.',
          target: '행정처분(영업정지·취소·과징금 등)을 받은 개인·사업자',
          documents: '처분 통지서, 사업 관련 서류, 소명 자료',
          processJson: proc(['처분 내용 분석', '구제 전략 수립', '청구서·증거 작성', '심판 진행 대응', '재결·후속 조치']),
          priceInfo: '사안별 상담 후 안내',
          faqJson: faq([{ q: '행정심판 청구 기한이 있나요?', a: '처분이 있음을 안 날부터 90일, 처분이 있은 날부터 180일 이내입니다. 기한 경과 전 신속히 상담받으세요.' }])
        },
        {
          categoryId: catCivil.id, sortOrder: 1, title: '계약서·내용증명 작성', slug: 'documents', icon: '✍️',
          summary: '각종 계약서, 내용증명, 진정서·탄원서를 전문적으로 작성합니다.',
          overview: '분쟁 예방과 권리 주장을 위한 계약서, 내용증명, 합의서, 진정서 등 권리의무 관련 서류를 작성합니다.',
          target: '계약 체결 예정자, 채권·분쟁 당사자',
          documents: '관련 계약·거래 자료, 상대방 정보',
          processJson: proc(['사실관계 상담', '문서 초안 작성', '검토·수정', '발송·후속 안내']),
          priceInfo: '문서 종류별 상담 후 안내',
          faqJson: faq([])
        }
      ]
    });
  }

  // 4) 자료실 (공지 + 블로그, 주제별 분류)
  const postCount = await prisma.post.count();
  if (postCount === 0) {
    await prisma.post.createMany({
      data: [
        {
          type: 'notice', topic: '공지', isPinned: true, title: '케이앤에스 글로벌 행정사무소 홈페이지 오픈 안내',
          content: '<p>안녕하십니까. 케이앤에스 글로벌 행정사무소 홈페이지가 새롭게 문을 열었습니다.</p><p>서비스 안내, 진행 절차, 자료실, 온라인 상담신청 기능을 제공합니다. 많은 이용 바랍니다.</p>'
        },
        {
          type: 'notice', topic: '공지', title: '상담 예약 안내 (평일 09:00~18:00)',
          content: '<p>전화(010-3547-1860) 또는 홈페이지 상담신청을 통해 예약하실 수 있습니다. 주말·공휴일은 사전 예약 시 상담 가능합니다.</p>'
        },
        {
          type: 'blog', topic: '비자·체류', title: 'E-7 특정활동 비자, 어떤 직종이 가능할까?',
          content: '<p>E-7 비자는 법무부 장관이 지정한 직종에 종사하려는 외국인에게 발급되는 취업비자입니다.</p><p>관리자·전문가·준전문인력 등 직종별 요건(학력·경력·연봉 기준)이 다르므로, 고용 전 반드시 요건 검토가 필요합니다. 고용업체의 업종·규모 요건도 함께 심사됩니다.</p><p>자세한 요건 진단은 상담을 통해 도와드립니다.</p>'
        },
        {
          type: 'blog', topic: '비자·체류', title: '체류기간 연장, 언제부터 신청할 수 있나요?',
          content: '<p>체류기간 연장허가는 만료일 4개월 전부터 신청할 수 있습니다. 만료일이 지난 후 신청하면 범칙금 부과 대상이 되므로 미리 준비하는 것이 중요합니다.</p><p>온라인(하이코리아) 사전예약 후 방문 또는 전자민원 신청이 가능하며, 자격별 제출서류가 다릅니다.</p>'
        },
        {
          type: 'blog', topic: '비자·체류', title: '결혼이민(F-6) 비자 준비 체크리스트',
          content: '<p>F-6 비자는 혼인의 진정성과 초청자의 소득 요건이 핵심 심사 대상입니다.</p><p>혼인신고 서류, 소득·주거 입증, 교제 입증자료를 꼼꼼히 준비해야 하며, 과거 초청 이력 등에 따라 심사가 강화될 수 있습니다.</p>'
        },
        {
          type: 'blog', topic: '귀화·국적', title: '간이귀화와 일반귀화, 무엇이 다른가요?',
          content: '<p>일반귀화는 5년 이상 계속 거주 등 요건이 필요하지만, 한국인 배우자가 있거나 부모가 한국인인 경우 등은 간이귀화로 거주 요건이 완화됩니다.</p><p>공통적으로 생계유지 능력, 품행 단정, 기본소양(사회통합프로그램 등) 요건을 충족해야 합니다.</p>'
        },
        {
          type: 'blog', topic: '인허가', title: '일반음식점 영업신고, 계약 전 확인할 3가지',
          content: '<p>1) 건축물 용도: 근린생활시설 여부 확인. 2) 정화조 용량: 부족 시 증설 필요. 3) 소방·안전 요건: 다중이용업소 해당 여부.</p><p>임대차 계약 전에 확인하지 않으면 영업신고가 불가능한 경우가 있으니, 계약 전 검토를 권합니다.</p>'
        },
        {
          type: 'blog', topic: '인허가', title: '통신판매업 신고, 온라인 쇼핑몰 창업 필수 절차',
          content: '<p>온라인으로 상품을 판매하려면 사업자등록 후 관할 지자체에 통신판매업 신고를 해야 합니다.</p><p>구매안전서비스 이용확인증(에스크로)이 필요하며, 정부24를 통한 온라인 신고도 가능합니다.</p>'
        },
        {
          type: 'blog', topic: '법인·창업', title: '외국인투자법인(FDI) 설립 절차 한눈에 보기',
          content: '<p>외국인투자신고 → 자본금 송금 → 법인 설립 등기 → 사업자등록 → 외국인투자기업 등록 순으로 진행됩니다.</p><p>투자금 1억 원 이상이면 투자자에게 D-8 체류자격 신청 자격이 주어질 수 있어, 체류 설계와 함께 진행하는 것이 효율적입니다.</p>'
        },
        {
          type: 'blog', topic: '권리구제', title: '영업정지 처분을 받았다면? 행정심판으로 다투는 방법',
          content: '<p>행정심판은 행정처분이 있음을 안 날부터 90일 이내에 청구해야 합니다.</p><p>집행정지 신청을 함께 하면 심판 결과가 나올 때까지 영업을 계속할 수 있는 경우가 있습니다. 처분서를 받는 즉시 전문가와 대응 전략을 세우는 것이 중요합니다.</p>'
        },
        {
          type: 'blog', topic: '권리구제', title: '내용증명, 언제 어떻게 보내야 효과적일까?',
          content: '<p>내용증명은 그 자체로 법적 강제력은 없지만, 의사표시의 도달과 시점을 증명하는 강력한 증거가 됩니다.</p><p>채권 회수, 계약 해지 통보, 손해배상 청구 등에서 상대방을 심리적으로 압박하고 분쟁 대비 증거를 남기는 효과가 있습니다.</p>'
        }
      ]
    });
  }

  console.log('✅ 시드 완료: 관리자(' + username + '), 서비스, 자료실 데이터');
}

main().finally(() => prisma.$disconnect());
