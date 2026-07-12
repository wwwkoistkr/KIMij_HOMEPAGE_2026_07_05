/**
 * 케이앤에스 글로벌 행정사무소 - 상담문의 수신 스크립트
 * 역할: 홈페이지 상담폼 → ① 구글 시트에 기록 ② 관리자 알림 메일 ③ 방문자 자동 응답메일
 *
 * 설치 방법: docs/구글시트-연동-가이드.md 참조
 */

// ===== 설정 (필요 시 수정) =====
var ADMIN_EMAIL = 'ijkim4756@gmail.com';           // 새 문의 알림을 받을 관리자 메일
var OFFICE_NAME = '케이앤에스 글로벌 행정사무소';
var OFFICE_PHONE = '010-3547-1860';
var SHEET_NAME = '상담문의';                        // 기록할 시트 탭 이름

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // 1) 구글 시트에 기록
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['접수일시', '이름', '연락처', '이메일', '문의분야', '문의내용']);
      sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    }
    var kst = Utilities.formatDate(new Date(data.createdAt || new Date()), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
    sheet.appendRow([kst, data.name, data.phone, data.email || '', data.category, data.message]);

    // 2) 관리자 알림 메일
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: '[홈페이지 상담문의] ' + data.name + ' / ' + data.category,
      body:
        '새 상담문의가 접수되었습니다.\n\n' +
        '접수일시: ' + kst + '\n' +
        '이름: ' + data.name + '\n' +
        '연락처: ' + data.phone + '\n' +
        '이메일: ' + (data.email || '(미입력)') + '\n' +
        '문의분야: ' + data.category + '\n\n' +
        '--- 문의내용 ---\n' + data.message + '\n\n' +
        '※ 구글 시트에도 자동 기록되었습니다.'
    });

    // 3) 방문자 자동 응답메일 (이메일 입력 시)
    if (data.email) {
      MailApp.sendEmail({
        to: data.email,
        subject: '[' + OFFICE_NAME + '] 상담문의가 정상 접수되었습니다',
        htmlBody:
          '<div style="font-family:sans-serif;max-width:560px;margin:auto;border:1px solid #E3E8EF;border-radius:12px;overflow:hidden">' +
          '<div style="background:#0A0F1E;color:#fff;padding:24px"><h2 style="margin:0">' + OFFICE_NAME + '</h2></div>' +
          '<div style="padding:24px;color:#16202E;line-height:1.7">' +
          '<p><b>' + data.name + '</b>님, 안녕하세요.</p>' +
          '<p>남겨주신 상담문의(<b>' + data.category + '</b>)가 정상적으로 접수되었습니다.<br>' +
          '내용을 확인한 후 영업시간 내 빠르게 연락드리겠습니다.</p>' +
          '<div style="background:#F5F7FA;border-radius:8px;padding:16px;font-size:14px">' +
          '<b>문의 내용</b><br>' + String(data.message).replace(/\n/g, '<br>') + '</div>' +
          '<p style="font-size:14px;color:#5B6B7F">급하신 경우 <b>' + OFFICE_PHONE + '</b>으로 전화 주시면 더 빠르게 상담받으실 수 있습니다.</p>' +
          '</div>' +
          '<div style="background:#F5F7FA;padding:14px 24px;font-size:12px;color:#5B6B7F">본 메일은 발신전용입니다. · ' + OFFICE_NAME + '</div>' +
          '</div>',
        replyTo: ADMIN_EMAIL,
        name: OFFICE_NAME
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
