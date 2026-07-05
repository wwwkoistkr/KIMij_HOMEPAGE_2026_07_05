// OpenNext Cloudflare 어댑터 설정
// 문서: https://opennext.js.org/cloudflare
import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig({
  // 증분 정적 재생성(ISR) 캐시는 사용하지 않음(모든 라우트 dynamic).
  // 필요 시 아래에 incrementalCache 등을 추가할 수 있음.
});
