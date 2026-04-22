function confetti(x, y) {
  const colors = ['#ffd54f','#7c4dff','#4caf50','#e040fb','#29b6f6','#ff7043'];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-p';
    p.style.cssText = `left:${x-40+Math.random()*80}px;top:${y}px;background:${colors[Math.floor(Math.random()*colors.length)]};animation-delay:${Math.random()*.3}s;animation-duration:${.9+Math.random()*.6}s;`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 2000);
  }
}

function showFeedback(correct, text) {
  const fb = document.getElementById('feedback');
  fb.className = 'feedback-box show ' + (correct ? 'good' : 'bad');
  fb.innerHTML = (correct ? '✅ ' : '❌ ') + text;
  state.answers.push(correct);
  if (window.MathJax) MathJax.typesetPromise();
}

function earnPoints(pts) {
  state.score += pts;
  state.streak++;
  if (state.streak >= 3) state.score += 5;
  animateScore(state.score);
  document.getElementById('streak-display').textContent = state.streak;
  document.getElementById('score-box').classList.remove('bump');
  void document.getElementById('score-box').offsetWidth;
  document.getElementById('score-box').classList.add('bump');
  saveState();
}

function animateScore(target) {
  const el = document.getElementById('score-display');
  const start = parseInt(el.textContent) || 0;
  const dur = 600, steps = 20, inc = (target - start) / steps;
  let i = 0;
  const t = setInterval(() => {
    i++;
    el.textContent = Math.round(start + inc * i);
    if (i >= steps) { el.textContent = target; clearInterval(t); }
  }, dur / steps);
}

function spawnConfetti() {
  const btn = document.querySelector('.btn-check') ||
              document.querySelector('.choice-btn.correct') ||
              document.querySelector('.tf-btn.correct');
  if (!btn) return;
  const r = btn.getBoundingClientRect();
  confetti(r.left + r.width / 2, r.top);
}

function updateProgress() {
  const total = state.questions.length, done = state.qIndex;
  document.getElementById('progress-bar').style.width = (total ? (done / total * 100) : 0) + '%';
  document.getElementById('progress-label').textContent = `${done} / ${total}`;
}
