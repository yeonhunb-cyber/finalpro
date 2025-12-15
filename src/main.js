import './style.css';
import { setupChatbot } from './chatbot.js';

const app = document.querySelector('#app');
if (app) {
  setupChatbot(app);
}

