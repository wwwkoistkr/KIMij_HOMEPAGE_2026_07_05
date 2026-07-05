'use client';
// 히어로 우측 대표 사진 (이미지가 없거나 로드 실패 시 자동으로 숨김)
import { useState } from 'react';

export default function Portrait({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true);
  if (!src || !ok) return null;
  return (
    <div className="relative inline-block">
      {/* 골드 프레임 장식 */}
      <div className="absolute -inset-2.5 rounded-[28px] border-2 border-[var(--color-accent)]/50" aria-hidden="true" />
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-[var(--color-accent)]/25 blur-2xl" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src} alt={alt} onError={() => setOk(false)}
        className="relative w-56 sm:w-64 lg:w-80 aspect-[4/5] object-cover object-top rounded-3xl shadow-2xl"
      />
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--color-navy-900)]/80 backdrop-blur px-4 py-1.5 text-sm font-bold text-[var(--color-accent)]">
        대표 행정사
      </span>
    </div>
  );
}
