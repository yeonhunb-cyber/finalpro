import { ELEMENT_QUIZZES, collectElement, getGameState } from './gameState.js';

/**
 * 원소 퀴즈 모달 표시
 */
export function showElementQuizModal(elementNumber, onComplete) {
  const quiz = ELEMENT_QUIZZES[elementNumber];
  if (!quiz) {
    console.error(`Quiz not found for element ${elementNumber}`);
    return;
  }

  const state = getGameState();
  const alreadyCollected = state.collectedElements.includes(elementNumber);

  // 모달 생성
  const modal = document.createElement('div');
  modal.className = 'element-quiz-modal';
  modal.innerHTML = `
    <div class="element-quiz-content">
      <button class="element-quiz-close">×</button>
      <h2>원소 퀴즈</h2>
      ${alreadyCollected ? `
        <p class="element-quiz-already">이미 이 원소를 획득했습니다!</p>
      ` : `
        <p class="element-quiz-question">${quiz.question}</p>
        <div class="element-quiz-options">
          ${quiz.options.map((option, index) => `
            <button class="element-quiz-option" data-index="${index}">
              ${option}
            </button>
          `).join('')}
        </div>
        <p class="element-quiz-hint">힌트: ${quiz.hint}</p>
      `}
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => {
    modal.remove();
    if (typeof onComplete === 'function') {
      onComplete();
    }
  };

  // 닫기 버튼
  const closeBtn = modal.querySelector('.element-quiz-close');
  closeBtn.addEventListener('click', closeModal);

  // 배경 클릭 시 닫기
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  if (!alreadyCollected) {
    // 옵션 버튼 이벤트
    const optionButtons = modal.querySelectorAll('.element-quiz-option');
    optionButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedIndex = parseInt(btn.getAttribute('data-index'));
        const isCorrect = selectedIndex === quiz.answer;

        // 모든 버튼 비활성화
        optionButtons.forEach((b) => {
          b.disabled = true;
          if (parseInt(b.getAttribute('data-index')) === quiz.answer) {
            b.classList.add('correct');
          } else if (parseInt(b.getAttribute('data-index')) === selectedIndex && !isCorrect) {
            b.classList.add('wrong');
          }
        });

        if (isCorrect) {
          // 정답 - 원소 획득
          collectElement(elementNumber);
          showElementCollectedEffect(elementNumber);
          setTimeout(() => {
            closeModal();
          }, 2000);
        } else {
          // 오답
          btn.classList.add('wrong');
          setTimeout(() => {
            closeModal();
          }, 1500);
        }
      });
    });
  }
}

/**
 * 원소 획득 이펙트 표시
 */
function showElementCollectedEffect(elementNumber) {
  const effect = document.createElement('div');
  effect.className = 'element-collected-effect';
  effect.innerHTML = `
    <div class="element-collected-content">
      <div class="element-collected-icon">✨</div>
      <h3>원소 획득!</h3>
      <p>원소 번호 ${elementNumber}번을 획득했습니다!</p>
    </div>
  `;

  document.body.appendChild(effect);

  setTimeout(() => {
    effect.classList.add('show');
  }, 10);

  setTimeout(() => {
    effect.classList.remove('show');
    setTimeout(() => {
      effect.remove();
    }, 500);
  }, 2000);
}

