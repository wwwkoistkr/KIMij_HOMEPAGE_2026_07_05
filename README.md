# 케이앤에스 글로벌 행정사무소 홈페이지 + 관리자 CMS

## 프로젝트 개요
- **이름**: 케이앤에스 글로벌 행정사무소 홈페이지
- **목표**: 인허가·외국인 비자·법인설립·각종 신고 등 행정 서비스 소개 및 온라인 상담 접수, 관리자 CMS 제공
- **주요 기능**: 회사 소개, 서비스 안내, 자료실(공지/블로그), 온라인 상담신청, 관리자 대시보드/콘텐츠 관리

## 배포 URL
- **프로덕션**: https://kns-global.wwwkoistkr.workers.dev
- **관리자**: https://kns-global.wwwkoistkr.workers.dev/admin/login

## 기술 스택
- **프레임워크**: Next.js 15 (App Router)
- **배포**: Cloudflare Workers (OpenNext 어댑터 `@opennextjs/cloudflare`)
- **데이터 저장소**: Cloudflare KV (`KNS_DB`) — 전체 사이트 데이터를 단일 JSON 문서로 저장
- **파일 저장소**: Cloudflare R2 (`KNS_UPLOADS`) — 관리자 이미지/영상 업로드
- **인증**: HMAC 서명 세션 쿠키 + bcrypt 비밀번호 해시
- **스타일**: Tailwind CSS

## 데이터 아키텍처
- **데이터 모델**: Settings(회사정보/테마), ServiceCategory, Service, Inquiry(상담), Post(자료실), AdminUser
- **저장 방식**: KV의 단일 키 `db`에 전체 DB(JSON)를 저장/로드. 최초 접속 시 업종 표준 콘텐츠 자동 시드
- **업로드**: R2에 저장 후 `/uploads/<파일명>` 경로로 서빙

## 주요 기능 진입 URI
### 공개 사이트
- `/` — 메인(원페이지: 히어로/서비스/절차/상담 등)
- `/services/[slug]` — 서비스 상세 (예: `/services/visa`)
- `/blog?topic=...` — 블로그(주제별 필터)
- `/notice` — 공지사항
- `/posts/[id]` — 게시글 상세(조회수 증가)
- `/terms`, `/privacy` — 이용약관/개인정보처리방침

### API
- `POST /api/inquiries` — 상담 접수(공개, 레이트리밋/허니팟) · `GET`(관리자 목록)
- `PATCH|DELETE /api/inquiries/[id]` — 상담 상태/메모/삭제(관리자)
- `POST /api/auth` — 로그인 · `DELETE` 로그아웃
- `GET|PATCH /api/settings` — 사이트 설정(관리자)
- `GET|POST /api/services`, `PATCH|DELETE /api/services/[id]` — 서비스 관리
- `POST /api/categories`, `PATCH|DELETE /api/categories/[id]` — 카테고리 관리
- `GET|POST /api/posts`, `PATCH|DELETE /api/posts/[id]` — 자료실 관리
- `GET /api/dashboard` — 실시간 대시보드 데이터
- `PATCH /api/account` — 관리자 비밀번호 변경
- `POST /api/upload` — 이미지/영상 업로드(R2, 관리자, 최대 50MB)
- `GET /uploads/[name]` — R2 업로드 파일 서빙

## 관리자 사용 안내
1. `/admin/login` 접속
2. 초기 계정: **아이디 `admin` / 비밀번호 `admin1234`**
3. ⚠️ **로그인 후 반드시 [계정] 메뉴에서 비밀번호를 변경**하세요. (로그인 5회 실패 시 15분 잠금)
4. 대시보드에서 상담 현황, 서비스/자료실/설정 관리 가능

## 로컬 개발
```bash
npm install --legacy-peer-deps
npm run dev            # Next.js 개발 서버 (http://localhost:3000)
npm run preview        # OpenNext 빌드 + 로컬 Cloudflare 런타임 미리보기
```
> 참고: 로컬에서 `wrangler dev`(Cloudflare 런타임)를 쓰려면 Node.js 22+ 권장. 실제 배포는 Cloudflare 빌드 파이프라인에서 처리됩니다.

## 배포
```bash
npm run deploy         # opennextjs-cloudflare build && deploy
```
- **플랫폼**: Cloudflare Workers (본인 계정 / BYOK)
- **상태**: ✅ Active
- **바인딩**: KV `KNS_DB`, R2 `KNS_UPLOADS`
- **시크릿**: `SESSION_SECRET`, `ADMIN_USERNAME`, `ADMIN_INITIAL_PASSWORD`, `SHEETS_WEBHOOK_URL`
- **최종 업데이트**: 2026-07-05

## 미구현 / 향후 개선 권장
- 구글 시트 연동(`SHEETS_WEBHOOK_URL`)은 값 미설정 상태 — 필요 시 Apps Script 웹앱 URL을 시크릿으로 등록
- 사용자 지정 도메인 연결 (Cloudflare `wrangler` 또는 대시보드에서 커스텀 도메인 바인딩)
- 검색엔진 인증 메타(네이버/구글) `app/layout.tsx`의 verification 항목에 추가
- KV 단일 문서 방식은 소규모에 최적화 — 대규모 확장 시 Cloudflare D1(SQLite)로 이전 권장(`prisma/schema.prisma` 설계 참조)
