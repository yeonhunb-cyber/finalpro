import { auth, googleProvider, firebaseEnvValid } from './firebaseConfig.js';
import { signInWithPopup } from 'firebase/auth';

const GOOGLE_FORM_ENDPOINT =
  'https://docs.google.com/forms/d/e/1FAIpQLSeP6gEwC-szYW-YVSOSTlMWQwbVGndm7bgBb2BiS09pZBRTmw/formResponse';

/**
 * 로그인 페이지를 설정하는 함수
 * @param {HTMLElement} root
 * @param {{ onLogin?: () => void }} options
 */
export function setupLoginPage(root, { onLogin } = {}) {
  // Firebase가 초기화되지 않았으면 바로 학생 정보 입력 폼 표시
  if (!firebaseEnvValid || !auth) {
    console.warn('⚠️ Firebase가 초기화되지 않아 Google 로그인 없이 진행합니다.');
    showStudentInfoForm();
    return;
  }

  // Firebase 인증 상태 확인
  let unsubscribe = null;
  try {
    unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // 이미 로그인된 경우 학생 정보 입력 폼 표시
        showStudentInfoForm();
      } else {
        // 로그인되지 않은 경우 Google 로그인 화면 표시
        showGoogleLogin();
      }
    });
  } catch (error) {
    console.error('❌ Firebase 인증 상태 확인 실패:', error);
    // 에러 발생 시에도 학생 정보 입력 폼 표시
    showStudentInfoForm();
  }

  function showGoogleLogin() {
    root.innerHTML = `
      <div class="chat-page">
        <div class="chat-sky"></div>
        <div class="chat-desert"></div>

        <div class="chat-shell">
          <header class="chat-header">
            <div class="sphinx-avatar">
              <img
                src="/sphinx.png"
                alt="이집트 스핑크스"
                class="sphinx-face"
                onerror="this.style.display='none'; this.parentElement.classList.add('sphinx-fallback');"
              />
              <div class="sphinx-fallback-emoji">🧩</div>
            </div>
            <div class="header-text">
              <h1>고대 이집트 학습 기록실</h1>
              <p>스핑크스의 신전에 오신 것을 환영합니다. 먼저 Google 계정으로 로그인해주세요.</p>
            </div>
          </header>

          <main class="form-main">
            <div class="google-login-container">
              <div class="google-login-card">
                <h2>Google 로그인</h2>
                <p class="google-login-description">
                  스핑크스와 함께하는 화학 학습을 시작하려면<br/>
                  Google 계정으로 로그인해주세요.
                </p>
                <button id="google-login-button" class="google-login-button">
                  <svg class="google-icon" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Google로 로그인</span>
                </button>
                <p class="form-status" id="form-status"></p>
              </div>
            </div>
          </main>
        </div>
      </div>
    `;

    const googleLoginBtn = root.querySelector('#google-login-button');
    const statusEl = root.querySelector('#form-status');

    const showStatus = (message, type = 'info') => {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.dataset.type = type;
    };

    if (googleLoginBtn) {
      googleLoginBtn.addEventListener('click', async () => {
        // Firebase가 없으면 Google 로그인 버튼을 비활성화
        if (!auth || !googleProvider) {
          showStatus('Google 로그인을 사용할 수 없습니다. Firebase 설정을 확인해주세요.', 'error');
          return;
        }

        try {
          showStatus('로그인 중...', 'info');
          googleLoginBtn.disabled = true;
          
          const result = await signInWithPopup(auth, googleProvider);
          const user = result.user;
          
          // Google 로그인 성공 - 사용자 정보 저장
          const userInfo = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          };
          localStorage.setItem('firebaseUser', JSON.stringify(userInfo));
          
          showStatus('로그인 성공!', 'success');
          
          // 학생 정보 입력 폼으로 전환
          setTimeout(() => {
            showStudentInfoForm();
          }, 1000);
        } catch (error) {
          console.error('Google 로그인 오류:', error);
          let errorMessage = '로그인에 실패했습니다.';
          
          if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = '로그인 창이 닫혔습니다. 다시 시도해주세요.';
          } else if (error.code === 'auth/popup-blocked') {
            errorMessage = '팝업이 차단되었습니다. 브라우저 설정을 확인해주세요.';
          } else if (error.code === 'auth/network-request-failed') {
            errorMessage = '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
          }
          
          showStatus(errorMessage, 'error');
          googleLoginBtn.disabled = false;
        }
      });
    }
  }

  function showStudentInfoForm() {
    root.innerHTML = `
      <div class="chat-page">
        <div class="chat-sky"></div>
        <div class="chat-desert"></div>

        <div class="chat-shell">
          <header class="chat-header">
            <div class="sphinx-avatar">
              <img
                src="/sphinx.png"
                alt="이집트 스핑크스"
                class="sphinx-face"
                onerror="this.style.display='none'; this.parentElement.classList.add('sphinx-fallback');"
              />
              <div class="sphinx-fallback-emoji">🧩</div>
            </div>
            <div class="header-text">
              <h1>고대 이집트 학습 기록실</h1>
              <p>스핑크스의 신전에 오신 것을 환영합니다. 먼저 당신의 정보를 알려주세요.</p>
            </div>
            <button id="logout-google-button" class="chat-back-button">로그아웃</button>
          </header>

          <main class="form-main">
            <form id="login-form" class="form-grid">
              <section class="form-section">
                <h2>학생 정보 입력</h2>
                <div class="form-row">
                  <label for="school">학교</label>
                  <input id="school" name="entry.2013460554" type="text" required />
                </div>
                <div class="form-row form-row-inline">
                  <div>
                    <label for="grade">학년</label>
                    <input id="grade" name="entry.846833226" type="text" required />
                  </div>
                  <div>
                    <label for="class">반</label>
                    <input id="class" name="entry.13396605" type="text" required />
                  </div>
                </div>
                <div class="form-row">
                  <label for="name">이름</label>
                  <input id="name" name="entry.512804368" type="text" required />
                </div>
              </section>

              <div class="form-actions">
                <button type="submit" class="form-submit-button">로그인</button>
                <p class="form-status" id="form-status"></p>
              </div>
            </form>
          </main>
        </div>
      </div>
    `;

    const form = root.querySelector('#login-form');
    const statusEl = root.querySelector('#form-status');
    const logoutBtn = root.querySelector('#logout-google-button');

    const showStatus = (message, type = 'info') => {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.dataset.type = type;
    };

    // Google 로그아웃 버튼
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        // Firebase가 없으면 로그아웃 버튼 숨기기 또는 비활성화
        if (!auth) {
          localStorage.removeItem('firebaseUser');
          showGoogleLogin();
          return;
        }

        try {
          await auth.signOut();
          localStorage.removeItem('firebaseUser');
          showGoogleLogin();
        } catch (error) {
          console.error('로그아웃 오류:', error);
          // 에러가 나도 로컬 스토리지 정리 후 화면 전환
          localStorage.removeItem('firebaseUser');
          showGoogleLogin();
        }
      });
    }

    if (form) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const userInfo = {
          school: formData.get('entry.2013460554'),
          grade: formData.get('entry.846833226'),
          class: formData.get('entry.13396605'),
          name: formData.get('entry.512804368')
        };

        // 사용자 정보를 localStorage에 저장
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        // Google Form에 로그인 정보 전송
        const params = new URLSearchParams();
        params.append('entry.2013460554', userInfo.school || '');
        params.append('entry.846833226', userInfo.grade || '');
        params.append('entry.13396605', userInfo.class || '');
        params.append('entry.512804368', userInfo.name || '');

        showStatus('스핑크스의 서기들이 기록을 새기고 있어요...', 'info');

        try {
          await fetch(GOOGLE_FORM_ENDPOINT, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: params.toString()
          });

          showStatus('로그인 성공! 환영합니다.', 'success');
          
          // 로그인 성공 후 메뉴 페이지로 이동
          setTimeout(() => {
            if (typeof onLogin === 'function') {
              onLogin();
            }
          }, 1000);
        } catch (error) {
          console.error(error);
          showStatus('모래폭풍으로 인해 전송에 실패했어요. 네트워크를 확인한 뒤 다시 시도해 주세요.', 'error');
        }
      });
    }
  }

  // 초기 로그인 화면 표시 (Firebase가 있으면 Google 로그인, 없으면 학생 정보 폼)
  if (firebaseEnvValid && auth) {
    showGoogleLogin();
  } else {
    showStudentInfoForm();
  }
}
