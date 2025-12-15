import './style.css';
import { setupChatbot } from './chatbot.js';
import { setupLoginPage } from './loginPage.js';
import { setupMenuPage } from './menuPage.js';
import { setupPracticePage } from './practicePage.js';
import { setupStartPage } from './startPage.js';

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
      onGoToStart: () => render('start'),
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
      onGoBack: () => render('menu')
    });
  } else if (view === 'start') {
    setupStartPage(app, {
      onGoBack: () => render('menu')
    });
  }
}

// 처음에는 로그인 페이지를 보여준다.
// 로그인 상태 확인 (선택사항: localStorage에 userInfo가 있으면 메뉴로)
const userInfo = localStorage.getItem('userInfo');
render(userInfo ? 'menu' : 'login');


