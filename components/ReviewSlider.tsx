'use client';
// 고객 후기 카드 슬라이더 (자동 순환 + 수동 이동)
import { useEffect, useState } from 'react';

const REVIEWS = [
  { name: '김○○ 님', field: '비자 연장', text: '체류기간이 얼마 남지 않아 발을 동동 굴렀는데, 하루 만에 서류를 정리해 접수까지 해주셨습니다. 정말 감사합니다.' },
  { name: '박○○ 님', field: '음식점 인허가', text: '가게 계약 전에 입지 검토부터 도와주셔서 시행착오 없이 영업신고를 마쳤습니다. 창업자에게 꼭 필요한 서비스예요.' },
  { name: 'Nguyen ○○ 님', field: '귀화 신청', text: '복잡한 귀화 서류를 하나하나 챙겨주시고 면접 준비까지 도와주셨습니다. 덕분에 한국 국적을 취득했습니다.' },
  { name: '이○○ 님', field: '행정심판', text: '영업정지 처분으로 막막했는데 집행정지와 심판 청구를 신속히 진행해 주셔서 영업을 지킬 수 있었습니다.' },
  { name: '왕○○ 님', field: '외국인투자법인', text: '한국 진출 전 과정을 한국어와 서류 걱정 없이 진행했습니다. 글로벌 업무에 강하다는 말이 사실이었어요.' }
];

export default function ReviewSlider() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % REVIEWS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const visible = [REVIEWS[i], REVIEWS[(i + 1) % REVIEWS.length], REVIEWS[(i + 2) % REVIEWS.length]];

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-6">
        {visible.map((r, idx) => (
          <figure key={`${i}-${idx}`} className={`card p-7 ${idx > 0 ? 'hidden md:block' : ''}`}>
            <div className="text-[var(--color-accent)] text-xl mb-3" aria-hidden="true">★★★★★</div>
            <blockquote className="leading-relaxed text-[var(--color-ink)]">&ldquo;{r.text}&rdquo;</blockquote>
            <figcaption className="mt-5 text-sm text-[var(--color-slate-500,#5B6B7F)]">
              <b className="text-[var(--color-ink)]">{r.name}</b> · {r.field}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="후기 페이지">
        {REVIEWS.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} aria-label={`후기 ${idx + 1}번`}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === i ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-line)]'}`} />
        ))}
      </div>
    </div>
  );
}
