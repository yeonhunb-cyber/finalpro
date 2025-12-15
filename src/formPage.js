const GOOGLE_FORM_ENDPOINT =
  'https://docs.google.com/forms/d/e/1FAIpQLSeP6gEwC-szYW-YVSOSTlMWQwbVGndm7bgBb2BiS09pZBRTmw/formResponse';

/**
 * 고대 이집트 콘셉트의 기록 페이지를 설정하는 함수
 * @param {HTMLElement} root
 * @param {{ onGoToTutor?: () => void }} options
 */
export function setupFormPage(root, { onGoToTutor } = {}) {
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
            <p>스핑크스와의 모험을 마친 뒤, 당신의 여정을 이 사막의 비문에 남겨보세요.</p>
          </div>
        </header>

        <main class="form-main">
          <form id="egypt-form" class="form-grid">
            <section class="form-section">
              <h2>기본 정보</h2>
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
              <p class="form-status" id="form-status"></p>
            </div>
          </form>

          <div class="form-tutor-panel">
            <h2>AI 튜터와 여행 떠나기</h2>
            <p>
              스핑크스에게 궁금한 화학 이야기가 있다면,<br />
              아래 버튼을 눌러 AI 튜터와의 대화 공간으로 이동하세요.
            </p>
            <button id="go-ai-tutor" class="tutor-button">
              AI 튜터 만나러 가기
            </button>
          </div>
        </main>
      </div>
    </div>
  `;

  const form = root.querySelector('#egypt-form');
  const statusEl = root.querySelector('#form-status');
  const tutorBtn = root.querySelector('#go-ai-tutor');

  const showStatus = (message, type = 'info') => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.dataset.type = type;
  };

  // 폼 제출 기능은 제거 (AI 튜터 버튼만 사용)
  // 사용자 정보는 localStorage에 저장하여 챗봇 페이지에서 사용
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      // 폼 제출은 하지 않고, 정보만 저장
      const formData = new FormData(form);
      const userInfo = {
        school: formData.get('entry.2013460554'),
        grade: formData.get('entry.846833226'),
        class: formData.get('entry.13396605'),
        name: formData.get('entry.512804368')
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      showStatus('정보가 저장되었어요. AI 튜터를 만나러 가세요!', 'success');
    });
  }

  if (tutorBtn && typeof onGoToTutor === 'function') {
    tutorBtn.addEventListener('click', () => {
      // 사용자 정보 저장
      const form = root.querySelector('#egypt-form');
      if (form) {
        const formData = new FormData(form);
        const userInfo = {
          school: formData.get('entry.2013460554'),
          grade: formData.get('entry.846833226'),
          class: formData.get('entry.13396605'),
          name: formData.get('entry.512804368')
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
      }
      onGoToTutor();
    });
  }
}


