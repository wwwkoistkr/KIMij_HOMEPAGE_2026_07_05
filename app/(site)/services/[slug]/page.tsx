// 서비스 상세: 개요 → 대상 → 필요서류 → 절차 → 비용 → FAQ → 상담 CTA
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await db();
  const v = d.services.find((x) => x.slug === slug && x.isPublished);
  if (!v) notFound();
  const cat = d.categories.find((c) => c.id === v.categoryId);

  return (
    <>
      <section className="bg-[var(--color-navy-900)] text-white pt-32 lg:pt-40 pb-14">
        <div className="container-max px-6 lg:px-10">
          <p className="text-[var(--color-accent)] font-semibold text-sm">{cat?.name}</p>
          <h1 className="h-sec mt-2">{v.icon} {v.title}</h1>
          <p className="mt-4 text-white/70 max-w-2xl">{v.summary}</p>
        </div>
      </section>

      <section className="bg-[var(--color-bg)] section-pad">
        <div className="container-max px-0 lg:px-4 max-w-4xl space-y-10">
          <Block title="개요"><p className="leading-loose whitespace-pre-line">{v.overview}</p></Block>
          {v.target && <Block title="누가 필요한가요?"><p className="leading-loose whitespace-pre-line">{v.target}</p></Block>}
          {v.documents && (
            <Block title="필요 서류">
              <ul className="list-disc pl-5 space-y-1.5">
                {v.documents.split(',').map((doc) => <li key={doc}>{doc.trim()}</li>)}
              </ul>
              <p className="text-sm text-[var(--color-ink)]/50 mt-3">※ 개별 사안에 따라 서류가 추가·변경될 수 있습니다.</p>
            </Block>
          )}
          {v.process.length > 0 && (
            <Block title="진행 절차">
              <ol className="space-y-3">
                {v.process.map((st, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="pt-1">{st}</span>
                  </li>
                ))}
              </ol>
            </Block>
          )}
          {v.priceInfo && <Block title="비용 안내"><p>{v.priceInfo}</p></Block>}
          {v.faq.length > 0 && (
            <Block title="자주 묻는 질문">
              <div className="space-y-3">
                {v.faq.map((f, i) => (
                  <details key={i} className="card p-5 group">
                    <summary className="font-bold cursor-pointer list-none flex justify-between items-center">
                      Q. {f.q}<span className="text-[var(--color-accent)] group-open:rotate-45 transition-transform">＋</span>
                    </summary>
                    <p className="mt-3 text-[var(--color-ink)]/75 leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </Block>
          )}
        </div>
      </section>

      <section className="bg-[var(--color-navy-800)] text-white text-center section-pad !py-16">
        <h2 className="h-card text-2xl">지금 바로 상담해 보세요</h2>
        <p className="mt-2 text-white/60">사안을 알려주시면 가능 여부와 절차를 빠르게 진단해 드립니다.</p>
        <Link href="/#contact" className="btn btn-accent mt-7">무료 상담 신청</Link>
      </section>
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-6 lg:px-0">
      <h2 className="h-card mb-4 flex items-center gap-2">
        <span className="inline-block w-7 h-[3px] bg-[var(--color-accent)]" aria-hidden="true" />{title}
      </h2>
      {children}
    </div>
  );
}
