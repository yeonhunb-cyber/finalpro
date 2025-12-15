// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  // 환경 변수 파일(.env, .env.local 등)을 읽을 기본 디렉터리
  // 프로젝트 루트(/Users/park-yeonhun/Desktop/github/finalpro)를 명시적으로 지정
  envDir: './',

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  // 환경변수 접두사 명시 (VITE_로 시작하는 변수만 클라이언트에 노출)
  // 기본값이 'VITE_'이지만 명시적으로 설정하여 확실하게 함
  envPrefix: 'VITE_',
  
  // 환경변수 파일 로딩 설정 (명시적으로 지정)
  // Vite는 기본적으로 다음 순서로 환경변수를 로드합니다:
  // 1. .env
  // 2. .env.local (git에 커밋되지 않음)
  // 3. .env.[mode] (예: .env.development)
  // 4. .env.[mode].local (예: .env.development.local)
  // 이 설정은 기본 동작이므로 명시적으로 지정할 필요는 없지만,
  // 문제 해결을 위해 주석으로 명시함
});


