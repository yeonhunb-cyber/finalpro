/**
 * 메인 메뉴 페이지를 설정하는 함수
 * @param {HTMLElement} root
 * @param {{ onGoToTutor?: () => void, onGoToPractice?: () => void, onGoToStart?: () => void, onLogout?: () => void }} options
 */
export function setupMenuPage(root, { onGoToTutor, onGoToPractice, onGoToStart, onLogout } = {}) {
  // 사용자 정보 가져오기
  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};
  const userName = userInfo.name || '학생';

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
            <p>${userName}님, 스핑크스가 당신을 기다리고 있습니다.</p>
          </div>
          <button id="logout-button" class="chat-back-button">로그아웃</button>
        </header>

        <main class="menu-main">
          <div class="menu-grid">
            <button id="menu-ai-tutor" class="menu-button menu-button-primary">
              <div class="menu-button-icon">🤖</div>
              <div class="menu-button-text">
                <h3>AI 튜터</h3>
                <p>스핑크스와 화학에 대해 대화하기</p>
              </div>
            </button>

            <button id="menu-practice" class="menu-button menu-button-secondary">
              <div class="menu-button-icon">📚</div>
              <div class="menu-button-text">
                <h3>연습</h3>
                <p>화학 문제를 연습해보세요</p>
              </div>
            </button>

            <button id="menu-start" class="menu-button menu-button-tertiary">
              <div class="menu-button-icon">🎯</div>
              <div class="menu-button-text">
                <h3>시작</h3>
                <p>학습을 시작하세요</p>
              </div>
            </button>
          </div>
        </main>
      </div>
    </div>
  `;

  const aiTutorBtn = root.querySelector('#menu-ai-tutor');
  const practiceBtn = root.querySelector('#menu-practice');
  const startBtn = root.querySelector('#menu-start');
  const logoutBtn = root.querySelector('#logout-button');

  if (aiTutorBtn && typeof onGoToTutor === 'function') {
    aiTutorBtn.addEventListener('click', () => {
      onGoToTutor();
    });
  }

  if (practiceBtn && typeof onGoToPractice === 'function') {
    practiceBtn.addEventListener('click', () => {
      onGoToPractice();
    });
  }

  if (startBtn && typeof onGoToStart === 'function') {
    startBtn.addEventListener('click', () => {
      onGoToStart();
    });
  }

  if (logoutBtn && typeof onLogout === 'function') {
    logoutBtn.addEventListener('click', () => {
      onLogout();
    });
  }
}

