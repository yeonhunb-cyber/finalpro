import { askSphinx } from './api.js';

/**
 * 챗봇 UI를 #app 엘리먼트 안에 설정하는 함수
 * @param {HTMLElement} root
 */
export function setupChatbot(root) {
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
            <h1>이집트 스핑크스 화학 챗봇</h1>
            <p>“젊은 학자여, 화학에 대해 무엇이든 물어보라.”</p>
          </div>
        </header>

        <main class="chat-main">
          <div class="chat-messages" id="chat-messages"></div>
        </main>

        <footer class="chat-footer">
          <div class="chat-input-wrapper">
            <textarea
              id="chat-input"
              class="chat-input"
              rows="2"
              placeholder="예) 화학 반응식은 어떻게 균형을 맞추나요?  /  몰 개념을 쉽게 설명해 주세요."
            ></textarea>
            <button id="chat-send" class="chat-send-button">
              스핑크스에게 물어보기
            </button>
          </div>
          <p class="chat-hint">
            화학 관련 질문만 받아요. 너무 많은 개인정보는 적지 마세요.
          </p>
        </footer>
      </div>
    </div>
  `;

  const messagesEl = root.querySelector('#chat-messages');
  const inputEl = root.querySelector('#chat-input');
  const sendBtn = root.querySelector('#chat-send');

  /** @type {Array<{role: 'user' | 'assistant', content: string}>} */
  let history = [];
  let isSending = false;

  const addMessage = (role, content) => {
    const message = document.createElement('div');
    message.className = `message message-${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    const meta = document.createElement('div');
    meta.className = 'message-meta';
    meta.textContent = role === 'user' ? '학생' : '스핑크스';

    const text = document.createElement('div');
    text.className = 'message-text';
    text.textContent = content;

    bubble.appendChild(meta);
    bubble.appendChild(text);
    message.appendChild(bubble);

    messagesEl.appendChild(message);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  const setLoading = (loading) => {
    isSending = loading;
    sendBtn.disabled = loading;
    sendBtn.textContent = loading ? '스핑크스가 생각 중...' : '스핑크스에게 물어보기';
  };

  const sendQuestion = async () => {
    const question = inputEl.value.trim();
    if (!question || isSending) return;

    // 사용자 메시지 표시 및 기록
    addMessage('user', question);
    history.push({ role: 'user', content: question });
    inputEl.value = '';

    setLoading(true);

    try {
      const { answer, newMessage } = await askSphinx(question, history);
      history.push(newMessage);
      addMessage('assistant', answer);
    } catch (error) {
      console.error(error);
      addMessage(
        'assistant',
        '스핑크스가 잠시 사막의 모래바람에 가려졌어요. 잠시 후 다시 시도해 주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  sendBtn.addEventListener('click', sendQuestion);

  inputEl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendQuestion();
    }
  });

  // 초기 안내 메시지
  addMessage(
    'assistant',
    '나는 이집트의 스핑크스다. 원한다면 원자, 분자, 화학 반응, 주기율표, 산과 염기 등 화학에 대해 무엇이든 물어보아라. ' +
      '너의 수준에 맞게 쉽게, 차근차근 설명해 주겠다.'
  );
}


