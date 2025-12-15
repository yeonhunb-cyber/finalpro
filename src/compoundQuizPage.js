import { COMPOUND_QUIZZES, getGameState, saveGameState, updateFinalQuizStats } from './gameState.js';

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
  let wrongAnswers = 0;

  const updateProgress = () => {
    const progressEl = root.querySelector('.compound-quiz-progress');
    if (progressEl) {
      progressEl.textContent = `문제 ${currentQuizIndex + 1} / ${quizzes.length}`;
    }
  };

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

  updateProgress();

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
    } else {
      wrongAnswers++;
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

    setTimeout(() => {
      if (!isCorrect) {
        // 하나라도 틀리면 처음부터 다시
        currentQuizIndex = 0;
        correctAnswers = 0;
        wrongAnswers = 0;
        const questionEl = root.querySelector('#compound-quiz-question');
        questionEl.innerHTML = renderQuiz(quizzes[0], 0);
        updateProgress();
        attachQuizListeners();
      } else {
        // 다음 문제로
        currentQuizIndex++;
        updateProgress(); // 진행 상황 업데이트
        if (currentQuizIndex < quizzes.length) {
          const questionEl = root.querySelector('#compound-quiz-question');
          questionEl.innerHTML = renderQuiz(quizzes[currentQuizIndex], currentQuizIndex);
          attachQuizListeners();
        } else {
          // 모든 퀴즈 정답
          showQuizResult(correctAnswers, wrongAnswers, quizzes.length);
        }
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

  function showQuizResult(correct, wrong, total) {
    // 게임 통계 업데이트
    updateFinalQuizStats(correct, wrong);
    
    const questionEl = root.querySelector('#compound-quiz-question');
    questionEl.innerHTML = `
      <div class="compound-quiz-result">
        <div class="sphinx-happy-message">
          <div class="sphinx-happy-icon">🎉</div>
          <h2>퀴즈 완료!</h2>
          <p class="sphinx-happy-text">
            훌륭하다, 젊은이여!<br/>
            네가 보여준 지식에 나는 매우 기쁘다.<br/>
            고대 이집트의 지혜를 이어받을 자격이 있는 자다.<br/>
            정말 고맙다!
          </p>
        </div>
        <p class="compound-quiz-score">정답: ${correct} / ${total}</p>
        <p class="compound-quiz-message">
          ${correct === total 
            ? '완벽합니다! 모든 문제를 맞추셨습니다!' 
            : correct >= total * 0.6 
            ? '좋은 성적입니다!' 
            : '다시 도전해보세요!'}
        </p>
        <button id="compound-quiz-view-result" class="compound-quiz-complete-btn">
          결과 보기
        </button>
      </div>
    `;

    // 게임 상태 업데이트
    const state = getGameState();
    state.compoundQuizCompleted = true;
    saveGameState(state);

    const viewResultBtn = root.querySelector('#compound-quiz-view-result');
    if (viewResultBtn) {
      viewResultBtn.addEventListener('click', () => {
        showGameResult();
      });
    }
  }

  function showGameResult() {
    const state = getGameState();
    const stats = state.gameStats;
    
    const questionEl = root.querySelector('#compound-quiz-question');
    questionEl.innerHTML = `
      <div class="game-result-container">
        <h2>게임 결과</h2>
        <div class="game-result-stats">
          <div class="game-result-stat">
            <span class="stat-label">플레이 시간:</span>
            <span class="stat-value">${stats.playTime}분</span>
          </div>
          <div class="game-result-stat">
            <span class="stat-label">획득한 원소:</span>
            <span class="stat-value">${stats.collectedElementsCount}개</span>
          </div>
          <div class="game-result-stat">
            <span class="stat-label">정답률:</span>
            <span class="stat-value">${stats.accuracy}%</span>
          </div>
          <div class="game-result-stat">
            <span class="stat-label">원소 퀴즈 오답 횟수:</span>
            <span class="stat-value">${stats.elementQuizWrongCount}회</span>
          </div>
          <div class="game-result-stat">
            <span class="stat-label">최종 시험 시도 횟수:</span>
            <span class="stat-value">${stats.finalQuizAttempts}회</span>
          </div>
          <div class="game-result-stat">
            <span class="stat-label">최종 시험 정답 횟수:</span>
            <span class="stat-value">${stats.finalQuizCorrect}회</span>
          </div>
          <div class="game-result-stat">
            <span class="stat-label">최종 시험 오답 횟수:</span>
            <span class="stat-value">${stats.finalQuizWrong}회</span>
          </div>
        </div>
        <button id="game-result-submit" class="compound-quiz-complete-btn">
          결과 제출하기
        </button>
        <button id="game-result-close" class="compound-quiz-close-btn">
          닫기
        </button>
      </div>
    `;

    const submitBtn = root.querySelector('#game-result-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        submitToGoogleForm(stats);
      });
    }

    const closeBtn = root.querySelector('#game-result-close');
    if (closeBtn && typeof onComplete === 'function') {
      closeBtn.addEventListener('click', () => {
        onComplete();
      });
    }
  }

  function submitToGoogleForm(stats) {
    const GOOGLE_FORM_ENDPOINT = 'https://docs.google.com/forms/d/e/1FAIpQLSeP6gEwC-szYW-YVSOSTlMWQwbVGndm7bgBb2BiS09pZBRTmw/formResponse';
    
    const userInfoStr = localStorage.getItem('userInfo');
    const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

    const params = new URLSearchParams();
    
    // 사용자 정보
    if (userInfo.school) params.append('entry.2013460554', userInfo.school);
    if (userInfo.grade) params.append('entry.846833226', userInfo.grade);
    if (userInfo.class) params.append('entry.13396605', userInfo.class);
    if (userInfo.name) params.append('entry.512804368', userInfo.name);
    
    // 게임 통계
    params.append('entry.1605017716', stats.playTime || 0);
    params.append('entry.532682997', stats.collectedElementsCount || 0);
    params.append('entry.188482371', stats.accuracy || 0);
    params.append('entry.209476959', stats.elementQuizWrongCount || 0);
    params.append('entry.1926984219', stats.finalQuizAttempts || 0);
    params.append('entry.635952149', stats.finalQuizCorrect || 0);
    params.append('entry.287351206', stats.finalQuizWrong || 0);

    const submitBtn = root.querySelector('#game-result-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '제출 중...';
    }

    fetch(GOOGLE_FORM_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: params.toString()
    })
      .then(() => {
        if (submitBtn) {
          submitBtn.textContent = '제출 완료!';
          submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        }
        setTimeout(() => {
          if (typeof onComplete === 'function') {
            onComplete();
          }
        }, 1500);
      })
      .catch((error) => {
        console.error('Google Form 제출 실패:', error);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = '제출 실패 - 다시 시도';
        }
      });
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

