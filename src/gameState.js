/**
 * 게임 상태 관리 유틸리티
 */

// 화합물과 그 구성 원소들
export const COMPOUND_QUESTS = [
  {
    formula: 'H₂O',
    name: '물',
    elements: [1, 8], // H, O
    description: '생명의 근원이 되는 화합물'
  },
  {
    formula: 'CO₂',
    name: '이산화탄소',
    elements: [6, 8], // C, O
    description: '호흡과 연소로 생성되는 기체'
  },
  {
    formula: 'NaCl',
    name: '염화 나트륨',
    elements: [11, 17], // Na, Cl
    description: '식탁에서 만나는 소금'
  },
  {
    formula: 'CaCO₃',
    name: '탄산칼슘',
    elements: [20, 6, 8], // Ca, C, O
    description: '석회석과 대리석의 주성분'
  }
];

// 원소 퀴즈 데이터
export const ELEMENT_QUIZZES = {
  1: {
    question: '수소(H)의 원자 번호는?',
    options: ['1', '2', '3', '4'],
    answer: 0,
    hint: '가장 가벼운 원소'
  },
  2: {
    question: '헬륨(He)은 어떤 기체인가?',
    options: ['활성 기체', '비활성 기체', '독성 기체', '연소 기체'],
    answer: 1,
    hint: '풍선에 사용되는 기체'
  },
  3: {
    question: '리튬(Li)은 주로 어디에 사용되나?',
    options: ['의약품', '배터리', '연료', '건축 자재'],
    answer: 1,
    hint: '전자기기에 사용되는 배터리'
  },
  4: {
    question: '베릴륨(Be)의 특징은?',
    options: ['무겁고 부드러움', '가볍고 단단함', '투명함', '유연함'],
    answer: 1,
    hint: '합금에 사용되는 금속'
  },
  5: {
    question: '붕소(B)는 주로 어디에 사용되나?',
    options: ['의약품', '유리와 세라믹', '연료', '식품'],
    answer: 1,
    hint: '유리 제조에 사용'
  },
  6: {
    question: '탄소(C)의 동소체가 아닌 것은?',
    options: ['다이아몬드', '흑연', '금', '풀러렌'],
    answer: 2,
    hint: '생명체의 기본 뼈대'
  },
  7: {
    question: '질소(N)는 공기 중 몇 %를 차지하나?',
    options: ['21%', '78%', '50%', '10%'],
    answer: 1,
    hint: '공기 중 가장 많은 기체'
  },
  8: {
    question: '산소(O)는 무엇에 필수적인가?',
    options: ['호흡과 연소', '냉각', '보존', '용해'],
    answer: 0,
    hint: '생명체가 살아가는데 필요'
  },
  9: {
    question: '플루오린(F)의 특징은?',
    options: ['반응성이 작음', '반응성이 큼', '비활성', '안정적'],
    answer: 1,
    hint: '가장 반응성이 큰 할로젠'
  },
  10: {
    question: '네온(Ne)은 주로 어디에 사용되나?',
    options: ['의약품', '네온사인', '연료', '식품'],
    answer: 1,
    hint: '밝게 빛나는 기체'
  },
  11: {
    question: '나트륨(Na)은 무엇의 구성 원소인가?',
    options: ['물', '식염', '산소', '탄소'],
    answer: 1,
    hint: '소금의 구성 원소'
  },
  12: {
    question: '마그네슘(Mg)의 특징은?',
    options: ['무겁고 부드러움', '가볍고 단단함', '투명함', '유연함'],
    answer: 1,
    hint: '합금에 사용되는 가벼운 금속'
  },
  13: {
    question: '알루미늄(Al)은 주로 어디에 사용되나?',
    options: ['의약품', '캔과 비행기', '연료', '식품'],
    answer: 1,
    hint: '가볍고 잘 녹슬지 않는 금속'
  },
  14: {
    question: '규소(Si)는 무엇의 주성분인가?',
    options: ['물', '반도체 칩', '공기', '식품'],
    answer: 1,
    hint: '정보 기술의 핵심 원소'
  },
  15: {
    question: '인(P)은 무엇에 포함되나?',
    options: ['물', 'DNA와 뼈', '공기', '식품'],
    answer: 1,
    hint: '생명체의 중요한 성분'
  },
  16: {
    question: '황(S)은 주로 어디에 사용되나?',
    options: ['의약품', '비료와 고무', '연료', '식품'],
    answer: 1,
    hint: '비료의 중요한 성분'
  },
  17: {
    question: '염소(Cl)는 무엇에 사용되나?',
    options: ['의약품', '소독과 표백', '연료', '식품'],
    answer: 1,
    hint: '수영장 냄새의 원인'
  },
  18: {
    question: '아르곤(Ar)은 어떤 기체인가?',
    options: ['활성 기체', '비활성 기체', '독성 기체', '연소 기체'],
    answer: 1,
    hint: '전구에 사용되는 기체'
  },
  19: {
    question: '칼륨(K)은 무엇에 중요한가?',
    options: ['의약품', '세포와 신경 활동', '연료', '식품'],
    answer: 1,
    hint: '신경과 근육 활동에 필수'
  },
  20: {
    question: '칼슘(Ca)은 무엇의 주요 성분인가?',
    options: ['물', '뼈와 치아', '공기', '식품'],
    answer: 1,
    hint: '뼈의 주요 성분'
  },
  26: {
    question: '철(Fe)은 무엇의 주성분인가?',
    options: ['물', '강철', '공기', '식품'],
    answer: 1,
    hint: '혈액의 헤모글로빈에 포함'
  },
  29: {
    question: '구리(Cu)는 주로 어디에 사용되나?',
    options: ['의약품', '전선과 동전', '연료', '식품'],
    answer: 1,
    hint: '전기가 잘 통하는 금속'
  }
};

// 화합물 퀴즈 데이터
export const COMPOUND_QUIZZES = {
  'H₂O': [
    {
      question: '물(H₂O)의 화학식에서 H는 몇 개인가?',
      options: ['1', '2', '3', '4'],
      answer: 1
    },
    {
      question: '물의 분자량은?',
      options: ['16', '18', '20', '22'],
      answer: 1
    },
    {
      question: '물의 끓는점은?',
      options: ['90°C', '100°C', '110°C', '120°C'],
      answer: 1
    },
    {
      question: '물은 어떤 성질을 가지고 있나?',
      options: ['산성', '중성', '염기성', '양쪽성'],
      answer: 1
    },
    {
      question: '물의 가장 중요한 역할은?',
      options: ['연료', '용매', '연소', '냉각'],
      answer: 1
    }
  ],
  'CO₂': [
    {
      question: '이산화탄소(CO₂)는 어떻게 생성되나?',
      options: ['호흡과 연소', '광합성', '증발', '응축'],
      answer: 0
    },
    {
      question: 'CO₂는 어떤 효과를 일으키나?',
      options: ['냉각 효과', '온실 효과', '증발 효과', '응축 효과'],
      answer: 1
    },
    {
      question: 'CO₂의 분자량은?',
      options: ['40', '44', '48', '52'],
      answer: 1
    },
    {
      question: 'CO₂는 어떤 상태로 존재하나?',
      options: ['고체', '액체', '기체', '플라즈마'],
      answer: 2
    },
    {
      question: 'CO₂는 광합성에서 무엇으로 사용되나?',
      options: ['산물', '원료', '부산물', '촉매'],
      answer: 1
    }
  ],
  'NaCl': [
    {
      question: '염화 나트륨(NaCl)의 일반적인 이름은?',
      options: ['설탕', '소금', '베이킹 소다', '식초'],
      answer: 1
    },
    {
      question: 'NaCl은 어떤 성질을 가지고 있나?',
      options: ['산성', '중성', '염기성', '양쪽성'],
      answer: 1
    },
    {
      question: 'NaCl의 용도는?',
      options: ['연료', '조미료', '의약품', '연소제'],
      answer: 1
    },
    {
      question: 'NaCl은 물에 잘 녹나?',
      options: ['안 녹음', '조금 녹음', '잘 녹음', '완전히 녹음'],
      answer: 2
    },
    {
      question: 'NaCl의 분자량은?',
      options: ['55', '58.5', '60', '65'],
      answer: 1
    }
  ],
  'CaCO₃': [
    {
      question: '탄산칼슘(CaCO₃)은 무엇의 주성분인가?',
      options: ['물', '석회석', '공기', '식품'],
      answer: 1
    },
    {
      question: 'CaCO₃는 산과 반응하면 무엇을 생성하나?',
      options: ['물', '이산화탄소', '산소', '수소'],
      answer: 1
    },
    {
      question: 'CaCO₃의 용도는?',
      options: ['연료', '건축 자재', '의약품', '식품'],
      answer: 1
    },
    {
      question: 'CaCO₃는 어떤 색인가?',
      options: ['검은색', '흰색', '빨간색', '파란색'],
      answer: 1
    },
    {
      question: 'CaCO₃의 분자량은?',
      options: ['90', '100', '110', '120'],
      answer: 1
    }
  ]
};

/**
 * 게임 상태 가져오기
 */
export function getGameState() {
  const stateStr = localStorage.getItem('gameState');
  if (stateStr) {
    return JSON.parse(stateStr);
  }
  return {
    collectedElements: [],
    currentCompound: null,
    compoundQuizCompleted: false,
    gameStats: {
      playTime: 0, // 분 단위
      collectedElementsCount: 0,
      accuracy: 0, // %
      elementQuizWrongCount: 0,
      finalQuizAttempts: 0,
      finalQuizCorrect: 0,
      finalQuizWrong: 0,
      startTime: Date.now()
    }
  };
}

/**
 * 게임 상태 저장하기
 */
export function saveGameState(state) {
  localStorage.setItem('gameState', JSON.stringify(state));
}

/**
 * 원소 획득
 */
export function collectElement(elementNumber) {
  const state = getGameState();
  if (!state.collectedElements.includes(elementNumber)) {
    state.collectedElements.push(elementNumber);
    state.gameStats.collectedElementsCount = state.collectedElements.length;
    saveGameState(state);
  }
}

/**
 * 원소 퀴즈 오답 횟수 증가
 */
export function incrementElementQuizWrong() {
  const state = getGameState();
  state.gameStats.elementQuizWrongCount++;
  saveGameState(state);
}

/**
 * 최종 시험 통계 업데이트
 */
export function updateFinalQuizStats(correct, wrong) {
  const state = getGameState();
  state.gameStats.finalQuizAttempts++;
  state.gameStats.finalQuizCorrect = correct;
  state.gameStats.finalQuizWrong = wrong;
  
  // 정답률 계산
  const total = correct + wrong;
  if (total > 0) {
    state.gameStats.accuracy = Math.round((correct / total) * 100);
  }
  
  // 플레이 시간 계산 (분 단위)
  if (state.gameStats.startTime) {
    const playTimeMs = Date.now() - state.gameStats.startTime;
    state.gameStats.playTime = Math.round(playTimeMs / 60000); // 분으로 변환
  }
  
  saveGameState(state);
}

/**
 * 모든 필요한 원소를 모았는지 확인
 */
export function hasAllElements(compound) {
  const state = getGameState();
  return compound.elements.every((el) => state.collectedElements.includes(el));
}

/**
 * 게임 상태 초기화
 */
export function resetGameState() {
  localStorage.removeItem('gameState');
}

