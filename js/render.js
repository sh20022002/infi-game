function renderOrder(q) {
  const shuffled = [...q.steps].map((s, i) => ({ text: s, origIdx: i })).sort(() => Math.random() - .5);
  window._orderData = { q, shuffled };
  return `<div class="question-box">
    <div class="q-label">🔀 סדרו את השלבים</div>
    <div class="q-text">${q.prompt}</div>
    <div class="steps-container" id="steps-list">
      ${shuffled.map((s, i) => `
        <div class="step-item" draggable="true" data-idx="${i}" data-orig="${s.origIdx}">
          <span class="drag-handle">⠿</span>
          <span class="step-num">${i + 1}</span>
          <span class="step-text">${s.text}</span>
        </div>`).join('')}
    </div>
    <div class="feedback-box" id="feedback"></div>
    <button class="btn-check" onclick="checkOrder()">בדוק סדר ✓</button>
  </div>`;
}

function renderMCQ(q) {
  return `<div class="question-box">
    <div class="q-label">❓ בחר תשובה נכונה</div>
    <div class="q-text">${q.prompt}</div>
    <div class="choices">
      ${q.choices.map((c, i) => `<button class="choice-btn" onclick="checkMCQ(${i},this)">${c}</button>`).join('')}
    </div>
    <div class="feedback-box" id="feedback"></div>
  </div>`;
}

function renderTF(q) {
  return `<div class="question-box">
    <div class="q-label">✅ נכון או שקר?</div>
    <div class="q-text">${q.prompt}</div>
    <div class="tf-row">
      <button class="tf-btn" onclick="checkTF(true,this)">✓ נכון</button>
      <button class="tf-btn" onclick="checkTF(false,this)">✗ שקר</button>
    </div>
    <div class="feedback-box" id="feedback"></div>
  </div>`;
}

function renderFill(q) {
  return `<div class="question-box">
    <div class="q-label">✏️ מלא את החסר</div>
    <div class="q-text">${q.prompt}</div>
    <div class="hint-box">💡 רמז: ${q.hint}</div>
    <input class="blank-input" id="fill-input" placeholder="הקלד תשובה..."
      onkeydown="if(event.key==='Enter')checkFill()">
    <div>
      <button class="btn-check" onclick="checkFill()">בדוק ✓</button>
    </div>
    <div class="feedback-box" id="feedback"></div>
  </div>`;
}

function renderQuestion() {
  const q = state.questions[state.qIndex];
  if (!q) { showResult(); return; }
  updateProgress();
  let html = '';
  if (q.type === 'order') html = renderOrder(q);
  else if (q.type === 'mcq') html = renderMCQ(q);
  else if (q.type === 'tf') html = renderTF(q);
  else if (q.type === 'fill') html = renderFill(q);
  document.getElementById('game-area').innerHTML = html;
  if (window.MathJax) MathJax.typesetPromise();
  if (q.type === 'order') initDrag();
}

function initDrag() {
  const list = document.getElementById('steps-list');
  if (!list) return;
  let dragEl = null;
  list.addEventListener('dragstart', e => {
    dragEl = e.target.closest('.step-item');
    if (dragEl) dragEl.classList.add('dragging');
  });
  list.addEventListener('dragend', e => {
    if (dragEl) dragEl.classList.remove('dragging');
    dragEl = null;
    updateStepNumbers();
  });
  list.addEventListener('dragover', e => {
    e.preventDefault();
    const target = e.target.closest('.step-item');
    if (target && target !== dragEl) {
      const r = target.getBoundingClientRect();
      if (e.clientY - r.y < r.height / 2) list.insertBefore(dragEl, target);
      else list.insertBefore(dragEl, target.nextSibling);
    }
  });
}

function updateStepNumbers() {
  document.querySelectorAll('.step-item').forEach((el, i) => {
    el.querySelector('.step-num').textContent = i + 1;
  });
}
