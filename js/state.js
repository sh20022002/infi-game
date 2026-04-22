let state = {
  score: 0,
  streak: 0,
  topicId: null,
  mode: 'mcq',
  qIndex: 0,
  answers: [],
  questions: [],
  topicStars: {}
};

try {
  const saved = JSON.parse(localStorage.getItem('infi_state') || '{}');
  if (saved.score) state.score = saved.score;
  if (saved.topicStars) state.topicStars = saved.topicStars;
} catch(e) {}

function saveState() {
  try {
    localStorage.setItem('infi_state', JSON.stringify({ score: state.score, topicStars: state.topicStars }));
  } catch(e) {}
}
