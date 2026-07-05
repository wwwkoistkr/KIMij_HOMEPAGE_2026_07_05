// 이미지/영상 업로드: Cloudflare R2 저장 → 공개 URL 반환 (관리자)
import { NextRequest, NextResponse } from 'next/server';
import { guard } from '@/lib/guard';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const dynamic = 'force-dynamic';

const ALLOWED = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg', '.mp4', '.webm'];
const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.webm': 'video/webm'
};
const MAX_SIZE = 50 * 1024 * 1024; // 50MB (초고해상도 원본·히어로 영상 허용)

function extname(name: string): string {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i).toLowerCase() : '';
}

function randHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(req: NextRequest) {
  const g = await guard();
  if (g) return g;

  const form = await req.formData();
  const file = form.get('file') as File | null;
  if (!file) return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: '50MB 이하 파일만 업로드할 수 있습니다.' }, { status: 400 });

  const ext = extname(file.name || '');
  if (!ALLOWED.includes(ext)) {
    return NextResponse.json({ error: '이미지(jpg, png, webp, avif, gif, svg) 또는 영상(mp4, webm) 파일만 업로드할 수 있습니다.' }, { status: 400 });
  }

  const name = `${Date.now()}-${randHex(4)}${ext}`;
  const { env } = getCloudflareContext();
  const bucket = (env as unknown as { KNS_UPLOADS?: R2Bucket }).KNS_UPLOADS;
  if (!bucket) return NextResponse.json({ error: '스토리지가 구성되지 않았습니다.' }, { status: 500 });

  await bucket.put(name, await file.arrayBuffer(), {
    httpMetadata: { contentType: CONTENT_TYPES[ext] || 'application/octet-stream' }
  });

  // 업로드 파일은 /uploads/<name> 경로로 서빙 (아래 file 라우트)
  const url = `/uploads/${name}`;
  return NextResponse.json({ ok: true, url });
}
