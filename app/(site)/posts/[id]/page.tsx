// 게시글 상세 (공지/블로그 공용) + 조회수 증가
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db, persist } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = await db();
  const p = d.posts.find((x) => x.id === Number(id) && x.isPublished);
  if (!p) notFound();
  p.viewCount += 1;
  await persist();

  return (
    <>
      <section className="bg-[var(--color-navy-900)] text-white pt-32 lg:pt-40 pb-14">
        <div className="container-max px-6 lg:px-10 max-w-4xl">
          <p className="text-[var(--color-accent)] font-semibold text-sm">
            {p.type === 'notice' ? '공지사항' : `블로그 · ${p.topic}`}
          </p>
          <h1 className="h-sec mt-2">{p.title}</h1>
          <p className="mt-4 text-white/50 text-sm">{p.publishedAt.slice(0, 10)} · 조회 {p.viewCount}</p>
        </div>
      </section>
      <section className="bg-[var(--color-bg)] section-pad">
        <article className="container-max max-w-4xl prose-kr" dangerouslySetInnerHTML={{ __html: p.content }} />
        <div className="container-max max-w-4xl mt-12 pt-6 border-t border-[var(--color-line)]">
          <Link href={p.type === 'notice' ? '/notice' : '/blog'} className="btn btn-primary !py-2.5 !px-6 text-sm">
            ← 목록으로
          </Link>
        </div>
      </section>
    </>
  );
}
