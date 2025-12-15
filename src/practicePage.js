/**
 * 연습 페이지를 설정하는 함수
 * @param {HTMLElement} root
 * @param {{ onGoBack?: () => void, onGoToElement?: () => void, onGoToCompound?: () => void }} options
 */
export function setupPracticePage(root, { onGoBack, onGoToElement, onGoToCompound } = {}) {
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
            <h1>화학 연습</h1>
            <p>화학 문제를 연습해보세요</p>
          </div>
          <button id="practice-back-button" class="chat-back-button">돌아가기</button>
        </header>

        <main class="menu-main">
          <div class="menu-grid">
            <button id="element-practice-button" class="menu-button menu-button-primary">
              <div class="menu-button-icon">🧪</div>
              <div class="menu-button-text">
                <h3>원소 연습</h3>
                <p>주기율표와 원소 이름, 기호를 연습해 보세요.</p>
              </div>
            </button>

            <button id="compound-practice-button" class="menu-button menu-button-secondary">
              <div class="menu-button-icon">⚗️</div>
              <div class="menu-button-text">
                <h3>화합물 연습</h3>
                <p>일상 속 화합물의 이름과 화학식을 익혀 보세요.</p>
              </div>
            </button>
          </div>
        </main>
      </div>
    </div>
  `;

  const backBtn = root.querySelector('#practice-back-button');
  const elementBtn = root.querySelector('#element-practice-button');
  const compoundBtn = root.querySelector('#compound-practice-button');

  if (backBtn && typeof onGoBack === 'function') {
    backBtn.addEventListener('click', () => {
      onGoBack();
    });
  }

  if (elementBtn && typeof onGoToElement === 'function') {
    elementBtn.addEventListener('click', () => {
      onGoToElement();
    });
  }

  if (compoundBtn && typeof onGoToCompound === 'function') {
    compoundBtn.addEventListener('click', () => {
      onGoToCompound();
    });
  }
}

