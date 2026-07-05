// 블로그·자료실 목록 (주제별 필터)
import Link from 'next/link';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata = { title: '블로그·자료실 | 케이앤에스 글로벌 행정사무소' };

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  const all = (await db()).posts.filter((p) => p.type === 'blog' && p.isPublished)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const topics = Array.from(new Set(all.map((p) => p.topic)));
  const posts = topic ? all.filter((p) => p.topic === topic) : all;

  return (
    <>
      <section className="bg-[var(--color-navy-900)] text-white pt-32 lg:pt-40 pb-14">
        <div className="container-max px-6 lg:px-10">
          <span className="sec-caption">BLOG &amp; ARCHIVE</span>
          <h1 className="h-sec">블로그·자료실</h1>
          <p className="mt-3 text-white/60">행정 실무 정보와 사례를 주제별로 모았습니다.</p>
        </div>
      </section>
      <section className="bg-[var(--color-bg)] section-pad">
        <div className="container-max">
          {/* 주제별 필터 */}
          <div className="flex flex-wrap gap-2 mb-10">
            <Link href="/blog"
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${!topic ? 'bg-[var(--color-primary)] text-white border-transparent' : 'border-[var(--color-line)] hover:bg-[var(--color-bg-soft)]'}`}>
              전체
            </Link>
            {topics.map((tp) => (
              <Link key={tp} href={`/blog?topic=${encodeURIComponent(tp)}`}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${topic === tp ? 'bg-[var(--color-primary)] text-white border-transparent' : 'border-[var(--color-line)] hover:bg-[var(--color-bg-soft)]'}`}>
                {tp}
              </Link>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <Link key={p.id} href={`/posts/${p.id}`} className="card overflow-hidden group">
                {p.thumbnailUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.thumbnailUrl} alt="" className="w-full h-44 object-cover" loading="lazy" />
                )}
                <div className="p-6">
                  <span className="text-xs font-bold text-[var(--color-accent)]">{p.topic}</span>
                  <h2 className="font-bold text-lg mt-1 leading-snug group-hover:text-[var(--color-primary)] transition-colors">{p.title}</h2>
                  <p className="text-xs text-[var(--color-ink)]/40 mt-3">{p.publishedAt.slice(0, 10)} · 조회 {p.viewCount}</p>
                </div>
              </Link>
            ))}
            {posts.length === 0 && <p className="col-span-full text-center py-10 text-[var(--color-ink)]/40">등록된 글이 없습니다.</p>}
          </div>
        </div>
      </section>
    </>
  );
}
