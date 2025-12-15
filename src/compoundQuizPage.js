import { COMPOUND_QUIZZES, getGameState, saveGameState } from './gameState.js';

/**
 * 화합물 퀴즈 페이지
 */
export function setupCompoundQuizPage(root, { onComplete, onGoBack } = {}) {
  const state = getGameState();
  const compound = state.currentCompound;
  
  if (!compound) {
    console.error('No compound selected');
    if (typeof onGoBack === 'function') {
      onGoBack();
    }
    return;
  }

  const quizzes = COMPOUND_QUIZZES[compound.formula] || [];
  let currentQuizIndex = 0;
  let correctAnswers = 0;

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
            <h1>화합물 퀴즈</h1>
            <p>${compound.name}(${compound.formula})에 대한 퀴즈를 풀어보세요</p>
          </div>
          <button id="compound-quiz-back" class="chat-back-button">돌아가기</button>
        </header>

        <main class="compound-quiz-main">
          <div class="compound-quiz-container">
            <div class="compound-quiz-progress">
              문제 ${currentQuizIndex + 1} / ${quizzes.length}
            </div>
            <div class="compound-quiz-question" id="compound-quiz-question">
              ${quizzes.length > 0 ? renderQuiz(quizzes[0], 0) : '<p>퀴즈가 없습니다.</p>'}
            </div>
          </div>
        </main>
      </div>
    </div>
  `;

  function renderQuiz(quiz, index) {
    return `
      <h2>${quiz.question}</h2>
      <div class="compound-quiz-options">
        ${quiz.options.map((option, optIndex) => `
          <button class="compound-quiz-option" data-index="${optIndex}">
            ${option}
          </button>
        `).join('')}
      </div>
    `;
  }

  function handleAnswer(selectedIndex) {
    const currentQuiz = quizzes[currentQuizIndex];
    const isCorrect = selectedIndex === currentQuiz.answer;

    if (isCorrect) {
      correctAnswers++;
    }

    // 모든 옵션 버튼 비활성화
    const options = root.querySelectorAll('.compound-quiz-option');
    options.forEach((btn) => {
      btn.disabled = true;
      const btnIndex = parseInt(btn.getAttribute('data-index'));
      if (btnIndex === currentQuiz.answer) {
        btn.classList.add('correct');
      } else if (btnIndex === selectedIndex && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    // 다음 문제로
    setTimeout(() => {
      currentQuizIndex++;
      if (currentQuizIndex < quizzes.length) {
        const questionEl = root.querySelector('#compound-quiz-question');
        questionEl.innerHTML = renderQuiz(quizzes[currentQuizIndex], currentQuizIndex);
        attachQuizListeners();
      } else {
        // 모든 퀴즈 완료
        showQuizResult(correctAnswers, quizzes.length);
      }
    }, 1500);
  }

  function attachQuizListeners() {
    const options = root.querySelectorAll('.compound-quiz-option');
    options.forEach((btn) => {
      btn.addEventListener('click', () => {
        const selectedIndex = parseInt(btn.getAttribute('data-index'));
        handleAnswer(selectedIndex);
      });
    });
  }

  function showQuizResult(correct, total) {
    const questionEl = root.querySelector('#compound-quiz-question');
    questionEl.innerHTML = `
      <div class="compound-quiz-result">
        <h2>퀴즈 완료!</h2>
        <p class="compound-quiz-score">정답: ${correct} / ${total}</p>
        <p class="compound-quiz-message">
          ${correct === total 
            ? '완벽합니다! 모든 문제를 맞추셨습니다!' 
            : correct >= total * 0.6 
            ? '좋은 성적입니다!' 
            : '다시 도전해보세요!'}
        </p>
        <button id="compound-quiz-complete" class="compound-quiz-complete-btn">
          완료
        </button>
      </div>
    `;

    // 게임 상태 업데이트
    const state = getGameState();
    state.compoundQuizCompleted = true;
    saveGameState(state);

    const completeBtn = root.querySelector('#compound-quiz-complete');
    if (completeBtn && typeof onComplete === 'function') {
      completeBtn.addEventListener('click', () => {
        onComplete();
      });
    }
  }

  // 초기 퀴즈 리스너 연결
  if (quizzes.length > 0) {
    attachQuizListeners();
  }

  // 돌아가기 버튼
  const backBtn = root.querySelector('#compound-quiz-back');
  if (backBtn && typeof onGoBack === 'function') {
    backBtn.addEventListener('click', () => {
      onGoBack();
    });
  }
}

