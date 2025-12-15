const GOOGLE_FORM_ENDPOINT =
  'https://docs.google.com/forms/d/e/1FAIpQLSeP6gEwC-szYW-YVSOSTlMWQwbVGndm7bgBb2BiS09pZBRTmw/formResponse';

/**
 * 로그인 페이지를 설정하는 함수
 * @param {HTMLElement} root
 * @param {{ onLogin?: () => void }} options
 */
export function setupLoginPage(root, { onLogin } = {}) {
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

  const showStatus = (message, type = 'info') => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.dataset.type = type;
  };

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

