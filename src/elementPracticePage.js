const ELEMENTS = [
  { number: 1, symbol: 'H', name: '수소', description: '우주에서 가장 많은 원소. 물(H₂O)과 대부분의 유기 화합물에 포함된다.' },
  { number: 2, symbol: 'He', name: '헬륨', description: '반응성이 매우 작은 비활성 기체. 풍선, 기체 크로마토그래피 등에 사용된다.' },
  { number: 3, symbol: 'Li', name: '리튬', description: '가장 가벼운 금속. 2차 전지(리튬 이온 배터리)에 널리 사용된다.' },
  { number: 4, symbol: 'Be', name: '베릴륨', description: '가볍고 단단한 금속. 합금, X선 창 등에 사용되나 독성이 있어 주의가 필요하다.' },
  { number: 5, symbol: 'B', name: '붕소', description: '유리, 세라믹, 세제 등에 사용되는 준금속 원소.' },
  { number: 6, symbol: 'C', name: '탄소', description: '생명체의 기본 뼈대. 다이아몬드, 흑연, 풀러렌 등 다양한 동소체를 가진다.' },
  { number: 7, symbol: 'N', name: '질소', description: '공기 성분의 약 78%. 비활성한 기체로 보존, 냉각 등에 사용된다.' },
  { number: 8, symbol: 'O', name: '산소', description: '호흡과 연소에 필수적인 기체. 물과 대부분의 산화물에 포함된다.' },
  { number: 9, symbol: 'F', name: '플루오린', description: '가장 반응성이 큰 할로젠. 치약, 불소 처리 등에 이용된다.' },
  { number: 10, symbol: 'Ne', name: '네온', description: '비활성 기체. 네온사인과 조명에 사용된다.' },
  { number: 11, symbol: 'Na', name: '나트륨', description: '식염(NaCl)의 구성 원소. 신경 전달과 체액 조절에 중요하다.' },
  { number: 12, symbol: 'Mg', name: '마그네슘', description: '가볍고 단단한 금속. 합금, 인체의 효소 작용에 중요하다.' },
  { number: 13, symbol: 'Al', name: '알루미늄', description: '가볍고 잘 녹슬지 않는 금속. 캔, 창틀, 비행기 등에 널리 사용된다.' },
  { number: 14, symbol: 'Si', name: '규소', description: '반도체 칩과 유리, 모래의 주성분. 정보 기술의 핵심 원소.' },
  { number: 15, symbol: 'P', name: '인', description: 'DNA, ATP, 뼈 등에 포함. 비료의 중요한 성분.' },
  { number: 16, symbol: 'S', name: '황', description: '황산, 비료, 고무 가공 등에 사용. 단백질의 일부 아미노산에도 포함된다.' },
  { number: 17, symbol: 'Cl', name: '염소', description: '소독과 표백에 사용. 수영장 냄새의 주된 원인.' },
  { number: 18, symbol: 'Ar', name: '아르곤', description: '비활성 기체. 전구, 용접, 보호 기체로 사용된다.' },
  { number: 19, symbol: 'K', name: '칼륨', description: '세포 내에서 중요한 양이온. 신경과 근육 활동에 필수.' },
  { number: 20, symbol: 'Ca', name: '칼슘', description: '뼈와 치아의 주요 성분. 근육 수축과 혈액 응고에도 관여한다.' },
  { number: 26, symbol: 'Fe', name: '철', description: '강철의 주성분. 혈액의 헤모글로빈에 포함되어 산소 운반을 담당한다.' },
  { number: 29, symbol: 'Cu', name: '구리', description: '전기가 잘 통하는 금속. 전선, 동전, 합금(청동, 황동)의 주성분.' }
];

/**
 * 원소 연습 페이지
 * @param {HTMLElement} root
 * @param {{ onGoBack?: () => void }} options
 */
export function setupElementPracticePage(root, { onGoBack } = {}) {
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
            <h1>원소 연습</h1>
            <p>주기율표 속 주요 원소들의 기호와 특징을 익혀 보세요.</p>
          </div>
          <button id="element-back-button" class="chat-back-button">돌아가기</button>
        </header>

        <main class="practice-main">
          <div class="practice-grid">
            ${ELEMENTS.map(
              (el) => `
              <button
                class="practice-button"
                data-number="${el.number}"
              >
                <span class="practice-number">${el.number}</span>
                <span class="practice-symbol">${el.symbol}</span>
              </button>
            `
            ).join('')}
          </div>
        </main>
      </div>

      <div class="info-modal" id="element-info-modal" hidden>
        <div class="info-modal-content">
          <button class="info-modal-close" id="element-modal-close">×</button>
          <h2 id="element-modal-title"></h2>
          <p id="element-modal-subtitle"></p>
          <p id="element-modal-description"></p>
        </div>
      </div>
    </div>
  `;

  const backBtn = root.querySelector('#element-back-button');
  const modal = root.querySelector('#element-info-modal');
  const modalClose = root.querySelector('#element-modal-close');
  const titleEl = root.querySelector('#element-modal-title');
  const subtitleEl = root.querySelector('#element-modal-subtitle');
  const descEl = root.querySelector('#element-modal-description');

  if (backBtn && typeof onGoBack === 'function') {
    backBtn.addEventListener('click', () => {
      onGoBack();
    });
  }

  const openModalForElement = (number) => {
    const el = ELEMENTS.find((e) => e.number === number);
    if (!el || !modal || !titleEl || !subtitleEl || !descEl) {
      console.warn('Modal elements not found');
      return;
    }

    titleEl.textContent = `${el.number}번 원소 ${el.name}`;
    subtitleEl.textContent = `${el.symbol} (${el.name})`;
    descEl.textContent = el.description;
    modal.removeAttribute('hidden');
  };

  const closeModal = () => {
    if (modal) {
      modal.setAttribute('hidden', '');
    }
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  // 이벤트 위임 사용으로 안정성 향상
  const practiceGrid = root.querySelector('.practice-grid');
  if (practiceGrid) {
    practiceGrid.addEventListener('click', (event) => {
      const button = event.target.closest('.practice-button');
      if (!button) return;
      
      const num = Number(button.getAttribute('data-number'));
      if (num && !isNaN(num)) {
        openModalForElement(num);
      }
    });
  }
}


