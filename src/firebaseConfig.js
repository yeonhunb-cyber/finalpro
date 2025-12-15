import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

/**
 * Vite 프로젝트에서는 process.env 대신 import.meta.env를 사용해야 합니다.
 * Vite는 .env, .env.local, .env.[mode], .env.[mode].local 파일을 자동으로 읽습니다.
 * 환경변수는 반드시 VITE_ 접두사를 붙여야 클라이언트에서 접근 가능합니다.
 */

// Vite 환경변수 로딩 확인 (개발 모드에서만)
if (import.meta.env.DEV) {
  console.log('🔍 Vite 환경변수 로딩 확인:');
  console.log('   Mode:', import.meta.env.MODE);
  console.log('   Dev:', import.meta.env.DEV);
  console.log('   Base URL:', import.meta.env.BASE_URL);
  console.log('   프로젝트 루트:', import.meta.url);
  
  // import.meta.env 객체 자체 확인
  console.log('   import.meta.env 타입:', typeof import.meta.env);
  console.log('   import.meta.env 키 개수:', Object.keys(import.meta.env).length);
}

// Firebase 설정값을 import.meta.env에서 읽어옵니다 (Vite 방식)
// 주의: process.env가 아닌 import.meta.env를 사용합니다!
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// 환경변수 체크 및 디버깅 정보 출력
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

// 환경변수 상태 확인 (더 정확한 검증)
const envStatus = requiredEnvVars.map((varName) => {
  const value = import.meta.env[varName];
  // undefined, null, 빈 문자열, 공백만 있는 경우를 모두 체크
  const exists = value !== undefined && value !== null;
  const hasValue = exists && typeof value === 'string' && value.trim().length > 0;
  const isEmpty = exists && (!value || value.trim().length === 0);
  
  return {
    name: varName,
    exists,
    hasValue,
    isEmpty,
    rawValue: value,
    valueLength: value ? value.length : 0
  };
});

// 개발 모드에서만 상세 정보 출력
if (import.meta.env.DEV) {
  console.log('📋 Firebase 환경변수 상태:');
  envStatus.forEach((status) => {
    if (status.hasValue) {
      // 값의 일부만 표시 (보안)
      const preview = status.rawValue.length > 20 
        ? status.rawValue.substring(0, 20) + '...' 
        : status.rawValue;
      console.log(`   ✅ ${status.name}: 로드됨 (길이: ${status.valueLength}, 값: ${preview})`);
    } else if (status.isEmpty) {
      console.log(`   ⚠️  ${status.name}: 변수는 존재하지만 값이 비어있음 (빈 문자열)`);
      console.log(`      → .env 파일에서 ${status.name}= 뒤에 실제 값을 입력해주세요`);
    } else {
      console.log(`   ❌ ${status.name}: 변수 자체가 없음 (undefined)`);
      console.log(`      → .env 또는 .env.local 파일에 ${status.name}=your_value 형식으로 추가해주세요`);
    }
  });
  
  // import.meta.env 전체 확인 (디버깅용)
  console.log('🔍 import.meta.env에서 VITE_로 시작하는 모든 변수:');
  const viteEnvVars = Object.keys(import.meta.env)
    .filter(key => key.startsWith('VITE_'))
    .sort();
  if (viteEnvVars.length > 0) {
    viteEnvVars.forEach(key => {
      const value = import.meta.env[key];
      const preview = value && value.length > 30 ? value.substring(0, 30) + '...' : value;
      console.log(`   - ${key}: ${preview || '(빈 값)'}`);
    });
  } else {
    console.log('   (VITE_로 시작하는 환경변수가 없습니다)');
  }
}

// 누락된 변수 찾기 (존재하지 않거나 빈 값인 경우)
const missingVars = envStatus.filter((status) => !status.hasValue).map((s) => s.name);

// Firebase 환경변수 유효 여부 플래그
const firebaseEnvValid = missingVars.length === 0;

if (!firebaseEnvValid) {
  console.error('❌ Firebase 환경변수가 누락되었거나 값이 비어있습니다:', missingVars);
  console.error('');
  console.error('⚠️ Firebase 로그인 기능은 비활성화되지만, 나머지 페이지는 정상적으로 동작합니다.');
  console.error('   .env 파일을 수정한 뒤, 나중에 개발 서버를 재시작하면 Firebase 로그인도 사용할 수 있습니다.');
}

// Firebase 초기화
let app = null;
let auth = null;
let googleProvider = null;

try {
  if (firebaseEnvValid) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    console.log('✅ Firebase 초기화 성공');
  } else {
    console.warn('⚠️ Firebase 환경변수가 완전하지 않아 Firebase 초기화를 건너뜁니다.');
  }
} catch (error) {
  console.error('❌ Firebase 초기화 실패:', error);
  console.error('⚠️ Firebase 로그인을 제외한 나머지 기능은 계속 사용할 수 있습니다.');
}

// Auth 관련 export
export { auth, googleProvider, firebaseEnvValid };

// Firebase 앱 인스턴스 export (필요한 경우)
export default app;

