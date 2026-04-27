function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function showHome() {
  showScreen('home');
  initHome();
}

function initHome() {
  const grid = document.getElementById('topic-grid');
  const done = Object.values(state.topicStars).filter(s => s >= 3).length;
  document.getElementById('stat-topics').textContent = TOPICS.length;
  document.getElementById('stat-score').textContent = state.score;
  document.getElementById('stat-done').textContent = done;
  grid.innerHTML = TOPICS.map(t => {
    const stars = state.topicStars[t.id] || 0;
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    return `<div class="topic-card${stars >= 3 ? ' done' : ''}" onclick="openTopic('${t.id}')">
      <div class="tc-stars">${starStr}</div>
      <div class="tc-icon">${t.icon}</div>
      <div class="tc-title">${t.title}</div>
      <div class="tc-sub">${t.sub}</div>
      <span class="tc-badge">${t.badge}</span>
    </div>`;
  }).join('');
}

function openTopic(id) {
  const topic = TOPICS.find(t => t.id === id);
  state.topicId = id;
  document.getElementById('topic-title').textContent = topic.icon + ' ' + topic.title;
  const stmt = topic.proof.statement;
  const wrappedStmt = stmt.includes('$') ? stmt : `$$${stmt}$$`;
  document.getElementById('topic-desc').innerHTML =
    `<p style="margin-bottom:8px"><strong style="color:#fff">משפט:</strong> ${wrappedStmt}</p>
     <p style="color:var(--muted);font-size:.88rem;margin-top:6px">💡 <strong>רעיון:</strong> ${topic.proof.idea}</p>`;
  const modeLabels = { order:'🔀 סדר שלבים', mcq:'❓ רב-ברירה', tf:'✅ נכון/שקר', fill:'✏️ מלא חסר' };
  document.getElementById('mode-row').innerHTML = topic.modes.map((m, i) =>
    `<button class="mode-btn${i === 0 ? ' active' : ''}" onclick="setMode('${m}',this)">${modeLabels[m]}</button>`
  ).join('');
  state.mode = topic.modes[0];
  startGame(id, state.mode);
  showScreen('topic-screen');
  if (window.MathJax) MathJax.typesetPromise();
}

function setMode(mode, btn) {
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  state.mode = mode;
  startGame(state.topicId, mode);
}
