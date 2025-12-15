const COMPOUNDS = [
  { formula: 'H₂O', name: '물', description: '가장 중요한 용매. 생명체와 대부분의 화학 반응이 일어나는 매개체.' },
  { formula: 'CO₂', name: '이산화탄소', description: '호흡과 연소로 생성. 광합성의 원료이며 온실 효과 기체 중 하나.' },
  { formula: 'O₂', name: '산소 분자', description: '호흡과 연소에 필수적인 기체. 공기 중 약 21%를 차지한다.' },
  { formula: 'NaCl', name: '염화 나트륨(식염)', description: '음식의 간을 맞추는 조미료이자 체액의 중요한 성분.' },
  { formula: 'HCl', name: '염산', description: '강산. 위 속의 위산 성분이기도 하며, 실험실에서 많이 사용된다.' },
  { formula: 'H₂SO₄', name: '황산', description: '강산이자 탈수제. 비료, 자동차 배터리 등에서 중요한 산업용 화학물질.' },
  { formula: 'NaOH', name: '수산화 나트륨(가성 소다)', description: '강염기. 비누, 세제, 종이 제조 등에 사용된다.' },
  { formula: 'CaCO₃', name: '탄산칼슘', description: '석회석, 대리석, 조개껍데기, 달걀 껍질의 주성분.' },
  { formula: 'CH₃COOH', name: '아세트산(식초의 주성분)', description: '식초의 신맛을 내는 약산. 각종 유기 합성의 출발 물질.' },
  { formula: 'NH₃', name: '암모니아', description: '비료의 원료. 특유의 자극적인 냄새가 나며 염기성을 띤다.' },
  { formula: 'C₆H₁₂O₆', name: '포도당', description: '생명체의 대표적인 에너지원. 광합성 산물이며 세포 호흡의 기질.' },
  { formula: 'C₂H₅OH', name: '에탄올', description: '술의 주성분. 용매, 소독제 등으로도 사용된다.' },
  { formula: 'Ca(OH)₂', name: '수산화칼슘(소석회)', description: '약한 염기. 산성 토양을 중화하는 데 사용된다.' },
  { formula: 'NaHCO₃', name: '탄산수소나트륨(베이킹 소다)', description: '빵을 부풀리는 팽창제, 탈취제 등에 사용된다.' },
  { formula: 'KNO₃', name: '질산칼륨', description: '비료와 폭약의 원료. 산화제로 작용한다.' },
  { formula: 'CaSO₄·2H₂O', name: '황산칼슘 이수화물(석고)', description: '석고보드, 깁스에 사용되는 물질.' },
  { formula: 'Fe₂O₃', name: '산화철(Ⅲ)', description: '녹의 주성분. 도료의 안료 등으로 사용된다.' },
  { formula: 'CuSO₄·5H₂O', name: '황산구리(II) 오수화물', description: '파란색 결정. 농약, 실험실 시약 등으로 사용된다.' },
  { formula: 'HNO₃', name: '질산', description: '강산이자 강한 산화제. 비료, 폭약 제조에 사용된다.' },
  { formula: 'SiO₂', name: '이산화규소', description: '모래와 유리의 주성분. 유리, 광섬유 등에 쓰인다.' }
];

/**
 * 화합물 연습 페이지
 * @param {HTMLElement} root
 * @param {{ onGoBack?: () => void }} options
 */
export function setupCompoundPracticePage(root, { onGoBack } = {}) {
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
            <h1>화합물 연습</h1>
            <p>고등학교에서 자주 등장하는 대표적인 화합물을 정리해 봅시다.</p>
          </div>
          <button id="compound-back-button" class="chat-back-button">돌아가기</button>
        </header>

        <main class="practice-main">
          <div class="practice-grid">
            ${COMPOUNDS.map(
              (c, idx) => `
              <button
                class="practice-button practice-button-compound"
                data-index="${idx}"
              >
                <span class="practice-symbol">${c.formula}</span>
                <span class="practice-name">${c.name}</span>
              </button>
            `
            ).join('')}
          </div>
        </main>
      </div>

      <div class="info-modal" id="compound-info-modal" hidden>
        <div class="info-modal-content">
          <button class="info-modal-close" id="compound-modal-close">×</button>
          <h2 id="compound-modal-title"></h2>
          <p id="compound-modal-subtitle"></p>
          <p id="compound-modal-description"></p>
        </div>
      </div>
    </div>
  `;

  const backBtn = root.querySelector('#compound-back-button');
  const modal = root.querySelector('#compound-info-modal');
  const modalClose = root.querySelector('#compound-modal-close');
  const titleEl = root.querySelector('#compound-modal-title');
  const subtitleEl = root.querySelector('#compound-modal-subtitle');
  const descEl = root.querySelector('#compound-modal-description');

  if (backBtn && typeof onGoBack === 'function') {
    backBtn.addEventListener('click', () => {
      onGoBack();
    });
  }

  const openModalForCompound = (index) => {
    const c = COMPOUNDS[index];
    if (!c || !modal || !titleEl || !subtitleEl || !descEl) {
      console.warn('Modal elements not found');
      return;
    }

    titleEl.textContent = c.name;
    subtitleEl.textContent = c.formula;
    descEl.textContent = c.description;
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
      const button = event.target.closest('.practice-button-compound');
      if (!button) return;
      
      const idx = Number(button.getAttribute('data-index'));
      if (idx >= 0 && idx < COMPOUNDS.length) {
        openModalForCompound(idx);
      }
    });
  }
}


