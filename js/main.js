// Floating math background
const mathSymbols = ['∫','∑','∞','∂','∇','Δ','π','√','∀','∃','⟹','≤','≥','∈','⊂','∩','∪','lim','ε','δ','f\'','d/dx'];
const bg = document.getElementById('math-bg');
for (let i = 0; i < 22; i++) {
  const el = document.createElement('span');
  el.className = 'math-float';
  el.textContent = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
  el.style.cssText = `left:${Math.random()*100}%;animation-duration:${12+Math.random()*22}s;animation-delay:${-Math.random()*24}s;font-size:${1+Math.random()*2.5}rem;`;
  bg.appendChild(el);
}

document.getElementById('score-display').textContent = state.score;

initHome();
