import './style.css';
import { setupChatbot } from './chatbot.js';
import { setupLoginPage } from './loginPage.js';
import { setupMenuPage } from './menuPage.js';
import { setupPracticePage } from './practicePage.js';
import { setupStartPage } from './startPage.js';
import { setupElementPracticePage } from './elementPracticePage.js';
import { setupCompoundPracticePage } from './compoundPracticePage.js';
import { setupSphinxChallengePage, showAngrySphinx } from './sphinxChallengePage.js';
import { setupCompoundQuizPage } from './compoundQuizPage.js';
import { getGameState, hasAllElements } from './gameState.js';

const app = document.querySelector('#app');

function render(view) {
  if (!app) return;

  if (view === 'login') {
    setupLoginPage(app, {
      onLogin: () => render('menu')
    });
  } else if (view === 'menu') {
    setupMenuPage(app, {
      onGoToTutor: () => render('chat'),
      onGoToPractice: () => render('practice'),
      onGoToStart: () => render('sphinxChallenge'), // 시작 버튼을 누르면 스핑크스 챌린지로
      onLogout: () => {
        localStorage.removeItem('userInfo');
        render('login');
      }
    });
  } else if (view === 'chat') {
    setupChatbot(app, {
      onGoBack: () => render('menu')
    });
  } else if (view === 'practice') {
    setupPracticePage(app, {
      onGoBack: () => render('menu'),
      onGoToElement: () => render('elementPractice'),
      onGoToCompound: () => render('compoundPractice')
    });
  } else if (view === 'elementPractice') {
    setupElementPracticePage(app, {
      onGoBack: () => render('practice')
    });
  } else if (view === 'compoundPractice') {
    setupCompoundPracticePage(app, {
      onGoBack: () => render('practice')
    });
  } else if (view === 'start') {
    setupStartPage(app, {
      onGoBack: () => render('menu'),
      onGoToSphinx: () => {
        const state = getGameState();
        if (!state.currentCompound) {
          render('sphinxChallenge');
        } else {
          // 원소 수집 확인
          if (hasAllElements(state.currentCompound)) {
            // 모든 원소 수집 완료 - 화합물 퀴즈로
            render('compoundQuiz');
          } else {
            // 원소 부족 - 화난 스핑크스 표시
            showAngrySphinx(app, {
              onClose: () => render('start')
            });
          }
        }
      }
    });
  } else if (view === 'sphinxChallenge') {
    setupSphinxChallengePage(app, {
      onStartAdventure: () => render('start'),
      onGoBack: () => render('menu')
    });
  } else if (view === 'compoundQuiz') {
    setupCompoundQuizPage(app, {
      onComplete: () => {
        // 퀴즈 완료 후 메뉴로
        render('menu');
      },
      onGoBack: () => render('start')
    });
  }
}

// 처음에는 로그인 페이지를 보여준다.
// 로그인 상태 확인 (선택사항: localStorage에 userInfo가 있으면 메뉴로)
const userInfo = localStorage.getItem('userInfo');
render(userInfo ? 'menu' : 'login');


