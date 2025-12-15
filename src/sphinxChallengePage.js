import { COMPOUND_QUESTS, getGameState, resetGameState, saveGameState } from './gameState.js';

/**
 * 스핑크스 챌린지 페이지 (무서운 스핑크스 등장)
 */
export function setupSphinxChallengePage(root, { onStartAdventure, onGoBack } = {}) {
  // 매번 새로운 화합물로 도전 시작
  const state = getGameState();
  const randomCompound = COMPOUND_QUESTS[Math.floor(Math.random() * COMPOUND_QUESTS.length)];
  state.currentCompound = randomCompound;
  state.collectedElements = [];
  state.compoundQuizCompleted = false;

  // 게임 통계 초기화 및 시작 시간 설정
  state.gameStats = {
    playTime: 0,
    collectedElementsCount: 0,
    accuracy: 0,
    elementQuizWrongCount: 0,
    finalQuizAttempts: 0,
    finalQuizCorrect: 0,
    finalQuizWrong: 0,
    startTime: Date.now()
  };

  saveGameState(state);

  const currentCompound = state.currentCompound;

  root.innerHTML = `
    <div class="sphinx-challenge-page" id="sphinx-challenge-page">
      <div class="sphinx-challenge-sky"></div>
      <div class="sphinx-challenge-desert"></div>

      <div class="sphinx-challenge-container">
        <div class="sphinx-challenge-sphinx" id="sphinx-challenge-sphinx">
          <div class="sphinx-challenge-eyes">
            <div class="sphinx-eye sphinx-eye-left"></div>
            <div class="sphinx-eye sphinx-eye-right"></div>
          </div>
          <div class="sphinx-challenge-mouth"></div>
        </div>

        <div class="sphinx-challenge-dialog" id="sphinx-challenge-dialog">
          <h2 class="sphinx-challenge-title">스핑크스의 도전</h2>
          <p class="sphinx-challenge-text" id="sphinx-challenge-text">
            젊은이여... 나는 고대의 수호자, 스핑크스다.<br/>
            너에게 한 가지 시험을 내리겠다.<br/><br/>
            <strong>${currentCompound.name}(${currentCompound.formula})</strong>를 구성하는 원소들을 찾아와라!<br/><br/>
            이 화합물을 만들기 위해 필요한 원소들을 모두 모아야 한다.<br/>
            피라미드로 가서 각 원소의 퀴즈를 풀고 원소를 획득하라!
          </p>
          <button id="sphinx-adventure-btn" class="sphinx-adventure-button">
            모험 떠나기
          </button>
        </div>

        <button id="sphinx-challenge-back" class="sphinx-challenge-back-button">돌아가기</button>
      </div>
    </div>
  `;

  // 화면 흔들림 효과
  const page = root.querySelector('#sphinx-challenge-page');
  page.classList.add('shake');

  setTimeout(() => {
    page.classList.remove('shake');
  }, 1000);

  // 모험 떠나기 버튼
  const adventureBtn = root.querySelector('#sphinx-adventure-btn');
  if (adventureBtn && typeof onStartAdventure === 'function') {
    adventureBtn.addEventListener('click', () => {
      onStartAdventure();
    });
  }

  // 돌아가기 버튼
  const backBtn = root.querySelector('#sphinx-challenge-back');
  if (backBtn && typeof onGoBack === 'function') {
    backBtn.addEventListener('click', () => {
      onGoBack();
    });
  }
}

/**
 * 화난 스핑크스 표시 (원소 부족 시)
 */
export function showAngrySphinx(root, { onClose } = {}) {
  const state = getGameState();
  const currentCompound = state.currentCompound;

  root.innerHTML = `
    <div class="sphinx-challenge-page angry-sphinx" id="angry-sphinx-page">
      <div class="sphinx-challenge-sky"></div>
      <div class="sphinx-challenge-desert"></div>

      <div class="sphinx-challenge-container">
        <div class="sphinx-challenge-sphinx angry" id="angry-sphinx">
          <div class="sphinx-challenge-eyes angry-eyes">
            <div class="sphinx-eye sphinx-eye-left angry-eye"></div>
            <div class="sphinx-eye sphinx-eye-right angry-eye"></div>
          </div>
          <div class="sphinx-challenge-mouth angry-mouth"></div>
        </div>

        <div class="sphinx-challenge-dialog angry-dialog">
          <h2 class="sphinx-challenge-title angry-title">스핑크스의 분노</h2>
          <p class="sphinx-challenge-text angry-text">
            아직 부족하다!<br/><br/>
            <strong>${currentCompound.name}(${currentCompound.formula})</strong>를 만들기 위한 원소들을 모두 모아오지 못했다!<br/><br/>
            다시 피라미드로 가서 모든 원소를 모아와라!
          </p>
        </div>
      </div>
    </div>
  `;

  // 화면 흔들림 효과
  const page = root.querySelector('#angry-sphinx-page');
  page.classList.add('shake-intense');

  // 3초 후 자동으로 닫기
  setTimeout(() => {
    page.classList.remove('shake-intense');
    if (typeof onClose === 'function') {
      onClose();
    }
  }, 3000);
}

