import './style.css';
import { setupChatbot } from './chatbot.js';
import { setupFormPage } from './formPage.js';

const app = document.querySelector('#app');

function render(view) {
  if (!app) return;

  if (view === 'chat') {
    setupChatbot(app, {
      onGoBack: () => render('form')
    });
  } else {
    setupFormPage(app, {
      onGoToTutor: () => render('chat')
    });
  }
}

// 처음에는 기록 페이지를 먼저 보여준다.
render('form');


