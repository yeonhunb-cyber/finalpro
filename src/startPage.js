/**
 * 시작 페이지를 설정하는 함수
 * @param {HTMLElement} root
 * @param {{ onGoBack?: () => void }} options
 */
export function setupStartPage(root, { onGoBack } = {}) {
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
            <h1>학습 시작</h1>
            <p>화학 학습을 시작하세요</p>
          </div>
          <button id="start-back-button" class="chat-back-button">돌아가기</button>
        </header>

        <main class="chat-main">
          <div class="start-content">
            <p>학습 시작 페이지가 곧 준비될 예정입니다.</p>
          </div>
        </main>
      </div>
    </div>
  `;

  const backBtn = root.querySelector('#start-back-button');
  if (backBtn && typeof onGoBack === 'function') {
    backBtn.addEventListener('click', () => {
      onGoBack();
    });
  }
}

