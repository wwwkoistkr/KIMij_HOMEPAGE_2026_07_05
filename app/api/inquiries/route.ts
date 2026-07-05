// 상담문의: POST(공개 접수) / GET(관리자 목록)
import { NextRequest, NextResponse } from 'next/server';
import { db, persist, nextId, now, type Inquiry } from '@/lib/db';
import { notifyInquiry } from '@/lib/notify';
import { guard } from '@/lib/guard';

export const dynamic = 'force-dynamic';

// 간단한 IP 기반 rate limit (분당 3회)
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const nowMs = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => nowMs - t < 60_000);
  arr.push(nowMs);
  hits.set(ip, arr);
  return arr.length > 3;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ error: '요청이 너무 잦습니다. 잠시 후 다시 시도해 주세요.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });

  // 허니팟: 봇이 채우는 숨김 필드
  if (body.website) return NextResponse.json({ ok: true });

  // 서버측 재검증
  const name = String(body.name || '').trim();
  const phone = String(body.phone || '').trim();
  const email = String(body.email || '').trim();
  const category = String(body.category || '기타').slice(0, 30);
  const message = String(body.message || '').trim();
  if (!name || name.length > 50) return NextResponse.json({ error: '이름을 확인해 주세요.' }, { status: 400 });
  if (!/^[0-9-]{9,13}$/.test(phone)) return NextResponse.json({ error: '연락처 형식을 확인해 주세요.' }, { status: 400 });
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: '이메일 형식을 확인해 주세요.' }, { status: 400 });
  if (message.length < 10 || message.length > 5000) return NextResponse.json({ error: '문의 내용을 10자 이상 입력해 주세요.' }, { status: 400 });
  if (!body.agree) return NextResponse.json({ error: '개인정보 수집·이용 동의가 필요합니다.' }, { status: 400 });

  const d = await db();
  const inquiry: Inquiry = {
    id: await nextId('inquiries'),
    name, phone, email, category, message,
    agreePrivacy: true, status: '신규', adminMemo: '',
    sourceIp: ip, userAgent: req.headers.get('user-agent') || '',
    createdAt: now(), handledAt: null
  };
  d.inquiries.push(inquiry);
  await persist(); // DB 저장 우선 보장

  // 구글 시트 기록 + 자동 응답메일 (실패해도 접수는 유지)
  await notifyInquiry({ ...inquiry, createdAt: new Date(inquiry.createdAt) });

  return NextResponse.json({ ok: true, id: inquiry.id });
}

export async function GET() {
  const g = await guard();
  if (g) return g;
  const list = [...(await db()).inquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json(list);
}
