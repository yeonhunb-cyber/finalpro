import { getGameState } from './gameState.js';

// 원소 기호 데이터 (startPage.js에서 가져오기)
const ELEMENT_SYMBOLS = [
  { number: 1, symbol: 'H', name: '수소' },
  { number: 2, symbol: 'He', name: '헬륨' },
  { number: 3, symbol: 'Li', name: '리튬' },
  { number: 4, symbol: 'Be', name: '베릴륨' },
  { number: 5, symbol: 'B', name: '붕소' },
  { number: 6, symbol: 'C', name: '탄소' },
  { number: 7, symbol: 'N', name: '질소' },
  { number: 8, symbol: 'O', name: '산소' },
  { number: 9, symbol: 'F', name: '플루오린' },
  { number: 10, symbol: 'Ne', name: '네온' },
  { number: 11, symbol: 'Na', name: '나트륨' },
  { number: 12, symbol: 'Mg', name: '마그네슘' },
  { number: 13, symbol: 'Al', name: '알루미늄' },
  { number: 14, symbol: 'Si', name: '규소' },
  { number: 15, symbol: 'P', name: '인' },
  { number: 16, symbol: 'S', name: '황' },
  { number: 17, symbol: 'Cl', name: '염소' },
  { number: 18, symbol: 'Ar', name: '아르곤' },
  { number: 19, symbol: 'K', name: '칼륨' },
  { number: 20, symbol: 'Ca', name: '칼슘' },
  { number: 26, symbol: 'Fe', name: '철' },
  { number: 29, symbol: 'Cu', name: '구리' }
];

/**
 * 기록보기 페이지
 */
export function setupRecordsPage(root, { onGoBack } = {}) {
  const state = getGameState();
  const stats = state.gameStats || {
    playTime: 0,
    collectedElementsCount: 0,
    accuracy: 0,
    elementQuizWrongCount: 0,
    finalQuizAttempts: 0,
    finalQuizCorrect: 0,
    finalQuizWrong: 0
  };

  const currentCompound = state.currentCompound;
  const collectedElements = state.collectedElements || [];

  // 획득한 원소 목록 생성
  const collectedElementsList = collectedElements
    .map((num) => {
      const element = ELEMENT_SYMBOLS.find((el) => el.number === num);
      return element ? `${element.number}번 ${element.symbol} (${element.name})` : null;
    })
    .filter((item) => item !== null);

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
            <h1>나의 학습 기록</h1>
            <p>스핑크스와 함께한 여정을 되돌아보세요</p>
          </div>
          <button id="records-back-button" class="chat-back-button">돌아가기</button>
        </header>

        <main class="records-main">
          <div class="records-container">
            <div class="records-section">
              <h2 class="records-section-title">게임 통계</h2>
              <div class="records-stats-grid">
                <div class="records-stat-card">
                  <div class="records-stat-icon">⏱️</div>
                  <div class="records-stat-info">
                    <div class="records-stat-label">플레이 시간</div>
                    <div class="records-stat-value">${stats.playTime}분</div>
                  </div>
                </div>
                <div class="records-stat-card">
                  <div class="records-stat-icon">✨</div>
                  <div class="records-stat-info">
                    <div class="records-stat-label">획득한 원소</div>
                    <div class="records-stat-value">${stats.collectedElementsCount}개</div>
                  </div>
                </div>
                <div class="records-stat-card">
                  <div class="records-stat-icon">🎯</div>
                  <div class="records-stat-info">
                    <div class="records-stat-label">정답률</div>
                    <div class="records-stat-value">${stats.accuracy}%</div>
                  </div>
                </div>
                <div class="records-stat-card">
                  <div class="records-stat-icon">❌</div>
                  <div class="records-stat-info">
                    <div class="records-stat-label">원소 퀴즈 오답</div>
                    <div class="records-stat-value">${stats.elementQuizWrongCount}회</div>
                  </div>
                </div>
                <div class="records-stat-card">
                  <div class="records-stat-icon">📝</div>
                  <div class="records-stat-info">
                    <div class="records-stat-label">최종 시험 시도</div>
                    <div class="records-stat-value">${stats.finalQuizAttempts}회</div>
                  </div>
                </div>
                <div class="records-stat-card">
                  <div class="records-stat-icon">✅</div>
                  <div class="records-stat-info">
                    <div class="records-stat-label">최종 시험 정답</div>
                    <div class="records-stat-value">${stats.finalQuizCorrect}회</div>
                  </div>
                </div>
                <div class="records-stat-card">
                  <div class="records-stat-icon">❌</div>
                  <div class="records-stat-info">
                    <div class="records-stat-label">최종 시험 오답</div>
                    <div class="records-stat-value">${stats.finalQuizWrong}회</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="records-section">
              <h2 class="records-section-title">현재 도전 중인 화합물</h2>
              <div class="records-compound-card">
                ${currentCompound 
                  ? `
                    <div class="records-compound-formula">${currentCompound.formula}</div>
                    <div class="records-compound-name">${currentCompound.name}</div>
                    <div class="records-compound-description">${currentCompound.description}</div>
                    <div class="records-compound-progress">
                      진행도: ${collectedElements.length} / ${currentCompound.elements.length}개 원소 획득
                    </div>
                  `
                  : '<p class="records-no-data">아직 도전 중인 화합물이 없습니다.</p>'
                }
              </div>
            </div>

            <div class="records-section">
              <h2 class="records-section-title">획득한 원소 목록</h2>
              <div class="records-elements-list">
                ${collectedElementsList.length > 0
                  ? collectedElementsList.map((el) => `
                      <div class="records-element-item">${el}</div>
                    `).join('')
                  : '<p class="records-no-data">아직 획득한 원소가 없습니다.</p>'
                }
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `;

  const backBtn = root.querySelector('#records-back-button');
  if (backBtn && typeof onGoBack === 'function') {
    backBtn.addEventListener('click', () => {
      onGoBack();
    });
  }
}

