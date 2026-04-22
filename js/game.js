function startGame(topicId, mode) {
  const topic = TOPICS.find(t => t.id === topicId);
  state.questions = topic.questions.filter(q => q.type === mode);
  if (!state.questions.length) {
    document.getElementById('game-area').innerHTML = '<div class="question-box"><p>אין שאלות במצב זה עדיין.</p></div>';
    return;
  }
  state.qIndex = 0;
  state.answers = [];
  updateProgress();
  renderQuestion();
}

function checkOrder() {
  const { q } = window._orderData;
  const items = [...document.querySelectorAll('.step-item')];
  const correctOrder = q.answer;
  let allCorrect = true;
  items.forEach((el, i) => {
    if (parseInt(el.dataset.orig) === correctOrder[i]) {
      el.classList.add('correct-pos');
      el.classList.remove('wrong-pos');
    } else {
      el.classList.add('wrong-pos');
      el.classList.remove('correct-pos');
      allCorrect = false;
    }
  });
  showFeedback(allCorrect, q.explanation);
  if (allCorrect) { earnPoints(20); spawnConfetti(); setTimeout(nextQuestion, 1800); }
  if (window.MathJax) MathJax.typesetPromise();
}

function checkMCQ(idx, btn) {
  const q = state.questions[state.qIndex];
  document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
  if (idx === q.answer) {
    btn.classList.add('correct');
    showFeedback(true, q.explanation);
    earnPoints(10);
    spawnConfetti();
    setTimeout(nextQuestion, 1800);
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.choice-btn')[q.answer].classList.add('correct');
    showFeedback(false, q.explanation);
    setTimeout(nextQuestion, 2600);
  }
}

function checkTF(val, btn) {
  const q = state.questions[state.qIndex];
  document.querySelectorAll('.tf-btn').forEach(b => b.disabled = true);
  if (val === q.answer) {
    btn.classList.add('correct');
    showFeedback(true, q.explanation);
    earnPoints(10);
    spawnConfetti();
    setTimeout(nextQuestion, 1800);
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('.tf-btn').forEach(b => {
      if ((b.textContent.includes('נכון') && q.answer) || (b.textContent.includes('שקר') && !q.answer))
        b.classList.add('correct');
    });
    showFeedback(false, q.explanation);
    setTimeout(nextQuestion, 2600);
  }
}

function checkFill() {
  const q = state.questions[state.qIndex];
  const val = document.getElementById('fill-input').value.trim().toLowerCase().replace(/\s/g, '');
  const ans = q.answer.toLowerCase().replace(/\s/g, '');
  const inp = document.getElementById('fill-input');
  inp.disabled = true;
  if (val === ans || val === ans.replace('^', '') || (ans.includes(val) && val.length > 1)) {
    inp.classList.add('correct');
    showFeedback(true, q.explanation);
    earnPoints(15);
    spawnConfetti();
    setTimeout(nextQuestion, 2000);
  } else {
    inp.classList.add('wrong');
    inp.classList.add('shake');
    showFeedback(false, `התשובה הנכונה: **${q.answer}**. ${q.explanation}`);
    setTimeout(nextQuestion, 3000);
  }
}

function nextQuestion() {
  state.qIndex++;
  renderQuestion();
}

function showResult() {
  const total = state.answers.length, correct = state.answers.filter(Boolean).length;
  const pct = total ? Math.round(correct / total * 100) : 0;
  let stars = pct >= 80 ? 3 : pct >= 50 ? 2 : 1;
  if (!total) stars = 0;
  state.topicStars[state.topicId] = Math.max(state.topicStars[state.topicId] || 0, stars);
  saveState();
  const emojis = ['😕','😐','🙂','🎉'];
  const titles = ['נסה שוב','בסדר','כל הכבוד!','מושלם! 🌟'];
  document.getElementById('result-emoji').textContent = emojis[stars];
  document.getElementById('result-title').textContent = titles[stars];
  document.getElementById('result-score').textContent = `ענית נכון על ${correct} מתוך ${total} (${pct}%)`;
  document.getElementById('result-stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
  document.getElementById('result-breakdown').innerHTML =
    `<h3>פירוט:</h3>` +
    state.answers.map((a, i) =>
      `<div class="rb-row"><span>שאלה ${i + 1}</span><span class="${a ? 'rb-ok' : 'rb-no'}">${a ? '✓' : '✗'}</span></div>`
    ).join('');
  document.getElementById('replay-btn').onclick = () => openTopic(state.topicId);
  showScreen('result-screen');
  state.streak = 0;
  document.getElementById('streak-display').textContent = '0';
  if (stars === 3) setTimeout(() => {
    for (let i = 0; i < 3; i++) setTimeout(() => confetti(window.innerWidth / 2, window.innerHeight / 3), i * 300);
  }, 200);
  if (window.MathJax) MathJax.typesetPromise();
}
