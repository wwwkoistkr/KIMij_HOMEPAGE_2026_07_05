// API 라우트 관리자 인증 가드
import { NextResponse } from 'next/server';
import { getAdminSession } from './auth';

export async function guard(): Promise<NextResponse | null> {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }
  return null;
}
