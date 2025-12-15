import { askSphinx } from './api.js';

const GOOGLE_FORM_ENDPOINT =
  'https://docs.google.com/forms/d/e/1FAIpQLSeP6gEwC-szYW-YVSOSTlMWQwbVGndm7bgBb2BiS09pZBRTmw/formResponse';

/**
 * 대화 내용을 Google Form에 제출하는 함수
 * @param {Array<{role: 'user' | 'assistant', content: string}>} history
 * @param {{ school?: string, grade?: string, class?: string, name?: string }} userInfo
 * @returns {Promise<void>}
 */
async function submitConversationToGoogleForm(history, userInfo = {}) {
  // 대화 내용을 텍스트로 변환
  const conversationText = history
    .map((msg) => {
      const roleLabel = msg.role === 'user' ? '학생' : '스핑크스';
      return `${roleLabel}: ${msg.content}`;
    })
    .join('\n\n');

  const params = new URLSearchParams();
  
  // 사용자 정보 추가
  if (userInfo.school) params.append('entry.2013460554', userInfo.school);
  if (userInfo.grade) params.append('entry.846833226', userInfo.grade);
  if (userInfo.class) params.append('entry.13396605', userInfo.class);
  if (userInfo.name) params.append('entry.512804368', userInfo.name);
  
  // 대화 내용 추가
  params.append('entry.898281198', conversationText);

  try {
    await fetch(GOOGLE_FORM_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: params.toString()
    });
    return true;
  } catch (error) {
    console.error('Google Form 제출 실패:', error);
    return false;
  }
}

/**
 * 챗봇 UI를 #app 엘리먼트 안에 설정하는 함수
 * @param {HTMLElement} root
 * @param {{ onGoBack?: () => void }} options
 */
export function setupChatbot(root, { onGoBack } = {}) {
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
          <button id="chat-back-button" class="chat-back-button">돌아가기</button>
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
  const backBtn = root.querySelector('#chat-back-button');

  /** @type {Array<{role: 'user' | 'assistant', content: string}>} */
  let history = [];
  let isSending = false;
  let isSubmitting = false;

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

  // 돌아가기 버튼 클릭 이벤트
  if (backBtn) {
    backBtn.addEventListener('click', async () => {
      if (isSubmitting) return;
      
      isSubmitting = true;
      backBtn.disabled = true;
      backBtn.textContent = '기록을 남기는 중...';

      // 사용자 정보 가져오기
      const userInfoStr = localStorage.getItem('userInfo');
      const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

      // 대화 내용 제출
      const success = await submitConversationToGoogleForm(history, userInfo);

      if (success) {
        // 성공 메시지 표시 (no-cors이므로 실제 성공 여부는 알 수 없지만 네트워크 오류가 없었다면 성공으로 간주)
        alert('스핑크스와의 대화가 사막의 비문에 기록되었어요. 감사합니다!');
      } else {
        alert('모래폭풍으로 인해 기록에 실패했어요. 네트워크를 확인한 뒤 다시 시도해 주세요.');
      }

      // 돌아가기 콜백 실행
      if (typeof onGoBack === 'function') {
        onGoBack();
      }
    });
  }

  // 초기 안내 메시지
  addMessage(
    'assistant',
    '나는 이집트의 스핑크스다. 원한다면 원자, 분자, 화학 반응, 주기율표, 산과 염기 등 화학에 대해 무엇이든 물어보아라. ' +
      '너의 수준에 맞게 쉽게, 차근차근 설명해 주겠다.'
  );
}


