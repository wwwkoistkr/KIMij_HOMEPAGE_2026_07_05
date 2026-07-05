// R2에 저장된 업로드 파일 서빙 (/uploads/<name>)
import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const { env } = getCloudflareContext();
  const bucket = (env as unknown as { KNS_UPLOADS?: R2Bucket }).KNS_UPLOADS;
  if (!bucket) return new NextResponse('Storage not configured', { status: 500 });

  const object = await bucket.get(name);
  if (!object) return new NextResponse('Not found', { status: 404 });

  const headers = new Headers();
  headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  if (object.httpEtag) headers.set('ETag', object.httpEtag);

  return new NextResponse(object.body as ReadableStream, { headers });
}
