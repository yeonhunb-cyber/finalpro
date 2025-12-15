const API_KEY = import.meta.env.VITE_GPT_API_KEY;
const MODEL = 'gpt-4o-mini';

if (!API_KEY) {
  // Vite + Netlify 환경에서 .env에 VITE_GPT_API_KEY가 설정되어 있어야 합니다.
  console.warn('VITE_GPT_API_KEY is not defined. Check your .env file.');
}

/**
 * 스핑크스에게 질문을 보내고 답변을 받아오는 함수
 * @param {string} question 사용자가 입력한 질문
 * @param {Array<{role: 'user' | 'assistant' | 'system', content: string}>} history 이전 대화 기록
 * @returns {Promise<{ answer: string, newMessage: { role: 'assistant', content: string } }>}
 */
export async function askSphinx(question, history = []) {
  const messages = [
    {
      role: 'system',
      content:
        'You are the mystical Sphinx of ancient Egypt, speaking Korean. ' +
        'You answer chemistry questions for middle and high school students. ' +
        'Always be kind and encouraging, and explain concepts step by step with simple Korean. ' +
        'Focus only on chemistry (atoms, molecules, reactions, periodic table, acids/bases, etc.). ' +
        'When helpful, include chemical equations and simple examples.'
    },
    ...history,
    {
      role: 'user',
      content: question
    }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages
    })
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const answer = data?.choices?.[0]?.message?.content?.trim() || '';
  const newMessage = {
    role: 'assistant',
    content: answer
  };

  return { answer, newMessage };
}


