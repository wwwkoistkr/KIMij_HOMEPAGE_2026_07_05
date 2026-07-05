// 세션 인증 (HMAC 서명 쿠키, 개발지침서 §8.1)
import crypto from 'crypto';
import { cookies } from 'next/headers';

const SECRET = () => process.env.SESSION_SECRET || 'dev-secret-change-me';
export const SESSION_COOKIE = 'kns_admin_session';
const SESSION_HOURS = 8;

export function signSession(username: string): string {
  const payload = Buffer.from(
    JSON.stringify({ u: username, exp: Date.now() + SESSION_HOURS * 3600_000 })
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifySession(token: string | undefined): { u: string } | null {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = crypto.createHmac('sha256', SECRET()).update(payload).digest('base64url');
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch { return null; }
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
  if (!data.exp || data.exp < Date.now()) return null;
  return { u: data.u };
}

export async function getAdminSession() {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

// API 라우트 가드: 미인증 시 401 응답을 던질 수 있게 결과 반환
export async function requireAdmin() {
  const s = await getAdminSession();
  if (!s) throw new Error('UNAUTHORIZED');
  return s;
}
