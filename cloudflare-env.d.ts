// Cloudflare 바인딩 타입 정의 (KV / R2)
// OpenNext의 getCloudflareContext().env 로 접근
interface CloudflareEnv {
  KNS_DB: KVNamespace;        // 전체 사이트 데이터(JSON 단일 문서)
  KNS_UPLOADS: R2Bucket;      // 관리자 이미지/영상 업로드
  ASSETS: Fetcher;            // 정적 자산
  // 환경 변수(시크릿)
  SESSION_SECRET?: string;
  ADMIN_USERNAME?: string;
  ADMIN_INITIAL_PASSWORD?: string;
  SHEETS_WEBHOOK_URL?: string;
}
