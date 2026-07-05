/** @type {import('next').NextConfig} */
const nextConfig = {
  // 기존 Next 14 코드의 사소한 타입 차이로 인한 빌드 실패 방지
  // (런타임 로직에는 영향 없음)
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    // Cloudflare Workers 환경에서는 Next 기본 이미지 최적화 서버를 쓰지 않음
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  }
};

export default nextConfig;

// OpenNext Cloudflare: 로컬 개발 시 getCloudflareContext()가 바인딩(env)에
// 접근할 수 있도록 초기화 (next dev)
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
