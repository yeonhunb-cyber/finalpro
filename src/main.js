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
import { setupRecordsPage } from './recordsPage.js';
import { getGameState, hasAllElements } from './gameState.js';
import { auth, firebaseEnvValid } from './firebaseConfig.js';

const app = document.querySelector('#app');

if (!app) {
  console.error('❌ #app 요소를 찾을 수 없습니다. index.html을 확인해주세요.');
  document.body.innerHTML = '<div style="padding: 20px; color: red;">앱을 초기화할 수 없습니다. #app 요소가 없습니다.</div>';
}

function render(view) {
  if (!app) {
    console.error('❌ #app 요소가 없어 렌더링할 수 없습니다.');
    return;
  }

  if (view === 'login') {
    setupLoginPage(app, {
      onLogin: () => render('menu')
    });
  } else if (view === 'menu') {
    setupMenuPage(app, {
      onGoToTutor: () => render('chat'),
      onGoToPractice: () => render('practice'),
      onGoToStart: () => render('sphinxChallenge'), // 시작 버튼을 누르면 스핑크스 챌린지로
      onGoToRecords: () => render('records'),
      onLogout: () => {
        localStorage.removeItem('userInfo');
        render('login');
      }
    });
  } else if (view === 'records') {
    setupRecordsPage(app, {
      onGoBack: () => render('menu')
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

// Firebase 인증 상태 확인 후 초기 화면 렌더링
// Firebase 환경변수가 올바르지 않거나 auth가 없으면, 그냥 기존 로그인 페이지를 바로 렌더링합니다.
try {
  if (!firebaseEnvValid || !auth) {
    console.warn('⚠️ Firebase Auth 없이 앱을 실행합니다. (환경변수 미설정 또는 초기화 실패)');
    // Firebase 없이도 로그인 페이지 표시
    setTimeout(() => {
      render('login');
    }, 100);
  } else {
    try {
      auth.onAuthStateChanged((user) => {
        try {
          if (user) {
            // Firebase 로그인된 경우
            const userInfo = localStorage.getItem('userInfo');
            render(userInfo ? 'menu' : 'login');
          } else {
            // Firebase 로그인되지 않은 경우
            render('login');
          }
        } catch (error) {
          console.error('❌ 렌더링 중 오류 발생:', error);
          // 에러 발생 시에도 로그인 페이지 표시 시도
          try {
            render('login');
          } catch (renderError) {
            console.error('❌ 로그인 페이지 렌더링도 실패:', renderError);
            if (app) {
              app.innerHTML = `
                <div style="padding: 40px; text-align: center; color: #facc15; background: rgba(15, 23, 42, 0.95); border-radius: 20px; margin: 20px;">
                  <h2>오류가 발생했습니다</h2>
                  <p>${error.message}</p>
                  <p style="margin-top: 20px; font-size: 0.9rem; opacity: 0.8;">브라우저 콘솔을 확인해주세요.</p>
                </div>
              `;
            }
          }
        }
      });
    } catch (error) {
      console.error('❌ Firebase 인증 상태 확인 실패:', error);
      // 에러 발생 시에도 로그인 페이지 표시 시도
      setTimeout(() => {
        render('login');
      }, 100);
    }
  }
} catch (error) {
  console.error('❌ 앱 초기화 중 치명적 오류:', error);
  // 최후의 수단: 기본 HTML 표시
  if (app) {
    app.innerHTML = `
      <div style="padding: 40px; text-align: center; color: #facc15; background: rgba(15, 23, 42, 0.95); border-radius: 20px; margin: 20px;">
        <h2>앱 초기화 오류</h2>
        <p>${error.message}</p>
        <p style="margin-top: 20px; font-size: 0.9rem; opacity: 0.8;">
          브라우저 콘솔을 확인해주세요.<br/>
          개발 서버가 정상적으로 실행 중인지 확인해주세요.
        </p>
      </div>
    `;
  }
}


