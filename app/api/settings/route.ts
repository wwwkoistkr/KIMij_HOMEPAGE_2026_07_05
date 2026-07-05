// 사이트 설정: 회사정보 + 테마 컬러 + 히어로 문구/이미지 (관리자)
import { NextRequest, NextResponse } from 'next/server';
import { db, persist, now, DEFAULT_THEME } from '@/lib/db';
import { guard } from '@/lib/guard';

export const dynamic = 'force-dynamic';

export async function GET() {
  const g = await guard();
  if (g) return g;
  return NextResponse.json((await db()).settings);
}

export async function PATCH(req: NextRequest) {
  const g = await guard();
  if (g) return g;
  const b = await req.json();
  const d = await db();
  const s = d.settings;

  const strFields = [
    'companyName', 'ceoName', 'phone', 'address', 'email', 'bizRegNo', 'businessHours',
    'kakaoUrl', 'greeting', 'heroBadge', 'heroTitle', 'heroSubtitle', 'heroImageUrl', 'heroPortraitUrl'
  ] as const;
  for (const f of strFields) {
    if (typeof b[f] === 'string') (s as unknown as Record<string, string>)[f] = b[f];
  }
  if (b.theme && typeof b.theme === 'object') {
    s.theme = { ...DEFAULT_THEME, ...s.theme, ...b.theme };
  }
  if (Array.isArray(b.stats)) {
    s.stats = b.stats
      .filter((x: { label?: string }) => x && x.label)
      .map((x: { label: string; value: number; suffix?: string }) => ({
        label: String(x.label), value: Number(x.value) || 0, suffix: String(x.suffix || '')
      }));
  }
  s.updatedAt = now();
  await persist();
  return NextResponse.json(s);
}
