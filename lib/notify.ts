// 상담문의 → 구글 시트 기록 + 자동 응답메일 (Google Apps Script 웹훅)
// 웹훅 URL 미설정 시 조용히 건너뜀 (DB 저장은 항상 보장)
export async function notifyInquiry(inquiry: {
  name: string; phone: string; email: string; category: string; message: string; createdAt: Date;
}) {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return { sent: false, reason: 'SHEETS_WEBHOOK_URL 미설정' };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: inquiry.name,
        phone: inquiry.phone,
        email: inquiry.email,
        category: inquiry.category,
        message: inquiry.message,
        createdAt: inquiry.createdAt.toISOString()
      }),
      // Apps Script는 리다이렉트를 사용하므로 follow
      redirect: 'follow'
    });
    return { sent: res.ok };
  } catch (e) {
    console.error('구글 시트 연동 실패(문의는 DB에 저장됨):', e);
    return { sent: false, reason: String(e) };
  }
}
