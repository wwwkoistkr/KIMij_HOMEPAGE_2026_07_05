// 메인 페이지: 원페이지 스크롤 구조 (섹션 간 여백 0 - 배경이 서로 맞닿음)
import Link from 'next/link';
import { db, getSettings } from '@/lib/db';
import Reveal from '@/components/Reveal';
import CountUp from '@/components/CountUp';
import ContactForm from '@/components/ContactForm';
import ReviewSlider from '@/components/ReviewSlider';
import Portrait from '@/components/Portrait';

export const dynamic = 'force-dynamic';

const TRUST = [
  { icon: '🎖️', title: '자격 검증', desc: '등록 행정사 직접 수행' },
  { icon: '📈', title: '풍부한 실적', desc: '누적 처리 2,400건+' },
  { icon: '🤝', title: '높은 만족도', desc: '상담 만족 98%' },
  { icon: '🌏', title: '원스톱 글로벌', desc: '외국인·국제 업무 전문' }
];

const WHY = [
  { icon: '⚡', title: '신속한 처리', desc: '접수 당일 검토를 시작하고, 진행 상황을 단계별로 알려드립니다.' },
  { icon: '🎯', title: '정확한 진단', desc: '착수 전에 요건을 먼저 진단해 불필요한 비용과 시행착오를 막습니다.' },
  { icon: '🌏', title: '글로벌 전문성', desc: '외국인 비자·체류, 귀화, 외국인투자 등 국제 업무에 강합니다.' },
  { icon: '🔒', title: '철저한 보안', desc: '의뢰인의 개인정보와 서류를 개인정보보호법에 따라 안전하게 관리합니다.' }
];

const PROCESS = [
  { no: '01', title: '무료 상담', desc: '전화·온라인으로 사안을 확인하고 가능 여부를 진단합니다.' },
  { no: '02', title: '서류 검토', desc: '필요 서류를 안내하고 요건 충족 여부를 정밀 검토합니다.' },
  { no: '03', title: '접수·대행', desc: '신청서를 작성하고 관할 기관에 접수를 대행합니다.' },
  { no: '04', title: '진행 관리', desc: '심사 과정에 대응하며 진행 상황을 실시간 공유합니다.' },
  { no: '05', title: '완료·사후관리', desc: '결과를 전달하고 후속 절차까지 안내합니다.' }
];

export default async function HomePage() {
  const s = await getSettings();
  const d = await db();
  const categories = [...d.categories].sort((a, b) => a.sortOrder - b.sortOrder);
  const services = d.services.filter((v) => v.isPublished).sort((a, b) => a.sortOrder - b.sortOrder);
  const posts = d.posts.filter((p) => p.isPublished);
  const notices = posts.filter((p) => p.type === 'notice')
    .sort((a, b) => Number(b.isPinned) - Number(a.isPinned) || b.publishedAt.localeCompare(a.publishedAt)).slice(0, 4);
  const blogs = posts.filter((p) => p.type === 'blog')
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 4);

  // hero background source: use admin-set value if present, otherwise default to the background video
  const heroSrc = s.heroImageUrl || '/hero.mp4';
  const heroLower = heroSrc.toLowerCase();
  const heroIsVideo = heroLower.endsWith('.mp4') || heroLower.endsWith('.webm') || heroLower.endsWith('.mov');

  return (
    <>
      {/* HERO - 풀블리드 배경(영상/이미지) + 딥네이비 오버레이 (관리자에서 교체 가능) */}
      <section id="home" className="relative overflow-hidden bg-[var(--color-navy-900)] text-white">
        {heroIsVideo ? (
          <video
            src={heroSrc}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-45"
            style={{ transform: 'scale(1.4)', transformOrigin: 'center top' }}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={heroSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-10"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-navy-900)]/70 via-[var(--color-navy-900)]/40 to-[var(--color-navy-900)]" aria-hidden="true" />
        {/* 블로그 바로가기 버튼 (히어로 왼쪽 위) — 클릭 시 네이버 블로그 새 탭 */}
        <a
          href="https://blog.naver.com/ijkim4756"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="블로그 바로가기 (새 탭)"
          className="group absolute left-4 top-24 lg:left-8 lg:top-28 z-20 inline-flex items-center gap-2 rounded-xl border border-white/25 bg-[var(--color-navy-800)]/85 px-4 py-2.5 text-sm font-bold text-white shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:bg-[var(--color-navy-700)]/90 hover:text-[var(--color-accent)]"
        >
          <span aria-hidden="true">📝</span>
          <span>블로그 바로가기</span>
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">↗</span>
        </a>
        <div className="relative container-max section-pad pt-28 lg:pt-36 pb-16 lg:pb-20 grid lg:grid-cols-[1.15fr_.85fr] gap-10 items-center">
          {/* 좌: 카피 */}
          <div className="text-center lg:text-left">
            <Reveal>
              <span className="inline-block rounded-full border border-[var(--color-accent)]/60 text-[var(--color-accent)] px-5 py-1.5 text-sm font-semibold tracking-wide mb-7">
                {s.heroBadge}
              </span>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="h-hero whitespace-pre-line">{s.heroTitle}</h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-6 text-white/75 text-lg max-w-2xl mx-auto lg:mx-0">{s.heroSubtitle}</p>
            </Reveal>
            <Reveal delay={360}>
              <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
                <Link href="/#contact" className="btn btn-accent">무료 상담 신청</Link>
                <Link href="/#services" className="btn btn-ghost">서비스 보기</Link>
              </div>
            </Reveal>
          </div>
          {/* 우: 대표 사진 (관리자 [사이트 설정]에서 업로드 시에만 표시) */}
          {s.heroPortraitUrl && (
            <Reveal delay={300} className="flex justify-center lg:justify-end">
              <Portrait src={s.heroPortraitUrl} alt={`${s.companyName} 대표`} />
            </Reveal>
          )}
        </div>
      </section>

      {/* ② 신뢰 스트립 - 히어로와 맞닿음 */}
      <section className="bg-[var(--color-navy-800)] text-white">
        <div className="container-max grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
          {TRUST.map((tItem) => (
            <div key={tItem.title} className="flex items-center gap-3 justify-center px-4 py-6">
              <span className="text-2xl" aria-hidden="true">{tItem.icon}</span>
              <div>
                <p className="font-bold text-sm lg:text-base">{tItem.title}</p>
                <p className="text-white/60 text-xs lg:text-sm">{tItem.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ③ ABOUT - 대표 인사말 + 강점 */}
      <section id="about" className="bg-[var(--color-bg)] section-pad">
        <div className="container-max grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <span className="sec-caption">ABOUT US</span>
              <h2 className="h-sec">행정사는 여러분의<br />심부름 전담부서입니다</h2>
              <p className="mt-6 whitespace-pre-line leading-loose text-[var(--color-ink)]/80">{s.greeting}</p>
              <p className="mt-6 font-bold">{s.companyName} {s.ceoName && `대표 ${s.ceoName}`}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1920&q=80"
                alt="상담 장면" loading="lazy"
                className="mt-8 w-full h-56 lg:h-64 object-cover rounded-lg2 shadow-card"
              />
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5">
            {WHY.slice(0, 4).map((w, i) => (
              <Reveal key={w.title} delay={i * 100}>
                <div className="card p-6 h-full">
                  <span className="text-3xl" aria-hidden="true">{w.icon}</span>
                  <h3 className="h-card mt-3">{w.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-ink)]/70 leading-relaxed">{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ④ SERVICES - 관리자 데이터 자동 반영 */}
      <section id="services" className="bg-[var(--color-bg-soft)] section-pad">
        <div className="container-max">
          <Reveal>
            <div className="text-center mb-12">
              <span className="sec-caption">SERVICES</span>
              <h2 className="h-sec">서비스·서류 안내</h2>
              <p className="mt-4 text-[var(--color-ink)]/60">필요한 업무를 선택하시면 대상·필요서류·절차를 확인하실 수 있습니다.</p>
            </div>
          </Reveal>
          {categories.map((cat) => {
            const list = services.filter((v) => v.categoryId === cat.id);
            if (!list.length) return null;
            return (
              <div key={cat.id} className="mb-10 last:mb-0">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="inline-block w-8 h-[3px] bg-[var(--color-accent)]" aria-hidden="true" />
                  {cat.name}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {list.map((v, i) => (
                    <Reveal key={v.id} delay={i * 80}>
                      <Link href={`/services/${v.slug}`} className="card p-6 flex flex-col h-full group">
                        <span className="text-3xl" aria-hidden="true">{v.icon}</span>
                        <h4 className="h-card mt-3 group-hover:text-[var(--color-primary)] transition-colors">{v.title}</h4>
                        <p className="mt-2 text-sm text-[var(--color-ink)]/70 leading-relaxed flex-1">{v.summary}</p>
                        <span className="mt-4 text-sm font-bold text-[var(--color-primary)]">자세히 보기 →</span>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ⑤ PROCESS - 다크 섹션 */}
      <section id="process" className="bg-[var(--color-navy-900)] text-white section-pad">
        <div className="container-max">
          <Reveal>
            <div className="text-center mb-14">
              <span className="sec-caption">PROCESS</span>
              <h2 className="h-sec">진행 절차</h2>
              <p className="mt-4 text-white/60">상담부터 완료까지, 모든 단계를 투명하게 안내합니다.</p>
            </div>
          </Reveal>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {PROCESS.map((p, i) => (
              <Reveal key={p.no} delay={i * 120}>
                <li className="relative rounded-card border border-white/10 bg-white/5 p-6 h-full">
                  <span className="text-[var(--color-accent)] font-extrabold text-2xl">{p.no}</span>
                  <h3 className="font-bold text-lg mt-2">{p.title}</h3>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">{p.desc}</p>
                  {i < PROCESS.length - 1 && (
                    <span className="hidden lg:block absolute top-1/2 -right-5 text-[var(--color-accent)]" aria-hidden="true">→</span>
                  )}
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ⑥ STATS - 카운트업 (다크 연속) */}
      <section id="stats" className="bg-[var(--color-navy-800)] text-white">
        <div className="container-max section-pad !py-16 grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {s.stats.map((st) => (
            <div key={st.label}>
              <p className="text-4xl lg:text-5xl font-extrabold"><CountUp value={st.value} suffix={st.suffix} /></p>
              <p className="mt-2 text-white/60">{st.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ⑦ WHY US */}
      <section className="bg-[var(--color-bg)] section-pad">
        <div className="container-max">
          <Reveal>
            <div className="text-center mb-12">
              <span className="sec-caption">WHY US</span>
              <h2 className="h-sec">왜 케이앤에스인가</h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 100}>
                <div className="text-center p-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[var(--color-bg-soft)] flex items-center justify-center text-3xl" aria-hidden="true">{w.icon}</div>
                  <h3 className="h-card mt-4">{w.title}</h3>
                  <p className="mt-2 text-sm text-[var(--color-ink)]/70 leading-relaxed">{w.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ⑧ REVIEWS */}
      <section id="reviews" className="bg-[var(--color-bg-soft)] section-pad">
        <div className="container-max">
          <Reveal>
            <div className="text-center mb-12">
              <span className="sec-caption">REVIEWS</span>
              <h2 className="h-sec">고객의 목소리</h2>
            </div>
          </Reveal>
          <ReviewSlider />
        </div>
      </section>

      {/* ⑨ NOTICE / BLOG 미리보기 */}
      <section id="notice" className="bg-[var(--color-bg)] section-pad">
        <div className="container-max">
          <Reveal>
            <div className="text-center mb-12">
              <span className="sec-caption">NEWS &amp; COLUMN</span>
              <h2 className="h-sec">공지·자료실</h2>
            </div>
          </Reveal>
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">공지사항</h3>
                <Link href="/notice" className="text-sm font-bold text-[var(--color-primary)]">전체 보기 →</Link>
              </div>
              <ul className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
                {notices.map((p) => (
                  <li key={p.id}>
                    <Link href={`/posts/${p.id}`} className="flex items-center gap-3 py-4 hover:bg-[var(--color-bg-soft)] px-2 transition-colors">
                      {p.isPinned && <span className="text-xs font-bold text-white bg-[var(--color-accent)] rounded px-1.5 py-0.5">고정</span>}
                      <span className="flex-1 truncate">{p.title}</span>
                      <span className="text-xs text-[var(--color-ink)]/40">{p.publishedAt.slice(0, 10)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">블로그·칼럼</h3>
                <Link href="/blog" className="text-sm font-bold text-[var(--color-primary)]">전체 보기 →</Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {blogs.map((p) => (
                  <Link key={p.id} href={`/posts/${p.id}`} className="card p-5 group">
                    <span className="text-xs font-bold text-[var(--color-accent)]">{p.topic}</span>
                    <p className="font-bold mt-1 leading-snug group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">{p.title}</p>
                    <p className="text-xs text-[var(--color-ink)]/40 mt-2">{p.publishedAt.slice(0, 10)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⑩ CONTACT - 상담문의 폼 + 오시는 길 */}
      <section id="contact" className="bg-[var(--color-bg-soft)] section-pad">
        <div className="container-max">
          <Reveal>
            <div className="text-center mb-12">
              <span className="sec-caption">CONTACT</span>
              <h2 className="h-sec">상담 문의</h2>
              <p className="mt-4 text-[var(--color-ink)]/60">남겨주신 문의는 확인 즉시 연락드립니다.</p>
            </div>
          </Reveal>
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="card p-7 lg:p-9 bg-white">
              <ContactForm />
            </div>
            <div className="space-y-5">
              <div className="card overflow-hidden bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1920&q=80"
                  alt="서류 상담" loading="lazy" className="w-full h-40 object-cover"
                />
                <div className="p-7">
                <h3 className="font-bold text-lg mb-4">오시는 길</h3>
                <ul className="space-y-2.5 text-[var(--color-ink)]/80">
                  <li>📍 {s.address}</li>
                  <li>📞 <a className="font-bold text-[var(--color-primary)]" href={`tel:${s.phone.replace(/-/g, '')}`}>{s.phone}</a></li>
                  <li>✉️ <a className="underline" href={`mailto:${s.email}`}>{s.email}</a></li>
                  <li>🕘 {s.businessHours}</li>
                </ul>
                </div>
              </div>
              <div className="card overflow-hidden bg-white">
                <iframe
                  title="오시는 길 지도"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed`}
                  className="w-full h-72 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
