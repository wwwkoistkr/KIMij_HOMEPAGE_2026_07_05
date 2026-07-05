// 공지사항 목록
import Link from 'next/link';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata = { title: '공지사항 | 케이앤에스 글로벌 행정사무소' };

export default async function NoticePage() {
  const posts = (await db()).posts.filter((p) => p.type === 'notice' && p.isPublished)
    .sort((a, b) => Number(b.isPinned) - Number(a.isPinned) || b.publishedAt.localeCompare(a.publishedAt));

  return (
    <>
      <section className="bg-[var(--color-navy-900)] text-white pt-32 lg:pt-40 pb-14">
        <div className="container-max px-6 lg:px-10">
          <span className="sec-caption">NOTICE</span>
          <h1 className="h-sec">공지사항</h1>
        </div>
      </section>
      <section className="bg-[var(--color-bg)] section-pad">
        <div className="container-max max-w-4xl">
          <ul className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
            {posts.map((p) => (
              <li key={p.id}>
                <Link href={`/posts/${p.id}`} className="flex items-center gap-3 py-5 px-2 hover:bg-[var(--color-bg-soft)] transition-colors">
                  {p.isPinned && <span className="text-xs font-bold text-white bg-[var(--color-accent)] rounded px-1.5 py-0.5">고정</span>}
                  <span className="flex-1 font-medium truncate">{p.title}</span>
                  <span className="text-sm text-[var(--color-ink)]/40">{p.publishedAt.slice(0, 10)}</span>
                </Link>
              </li>
            ))}
            {posts.length === 0 && <li className="py-10 text-center text-[var(--color-ink)]/40">등록된 공지가 없습니다.</li>}
          </ul>
        </div>
      </section>
    </>
  );
}
