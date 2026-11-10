const demo = document.querySelector('.word-demo');
const windowPane = demo.querySelector('.word-window');
const words = [...demo.querySelectorAll('input')];
let swipeStart;

windowPane.addEventListener('touchstart', (event) => {
  swipeStart = event.touches.length === 1 ? event.touches[0] : undefined;
}, { passive: true });

windowPane.addEventListener('touchend', (event) => {
  if (!swipeStart) return;
  const dx = event.changedTouches[0].clientX - swipeStart.clientX;
  const dy = event.changedTouches[0].clientY - swipeStart.clientY;
  swipeStart = undefined;
  if (Math.abs(dx) < 32 || Math.abs(dx) < Math.abs(dy)) return;
  const index = words.findIndex((word) => word.checked);
  words[(index + (dx < 0 ? 1 : -1) + words.length) % words.length].checked = true;
}, { passive: true });

windowPane.addEventListener('touchcancel', () => {
  swipeStart = undefined;
}, { passive: true });

const save = document.querySelector('.save');
const specimen = document.querySelector('.saved-item');
const status = document.querySelector('#save-status');
const key = 'rhiza:guide:port';
let collected = false;
try { collected = localStorage.getItem(key) === 'saved'; } catch { /* The demo still works in memory. */ }

function renderCollection() {
  save.setAttribute('aria-pressed', String(collected));
  specimen.hidden = !collected;
}

save.hidden = false;
renderCollection();
save.addEventListener('click', () => {
  collected = !collected;
  try {
    if (collected) localStorage.setItem(key, 'saved');
    else localStorage.removeItem(key);
  } catch { /* Keep the current state if storage is unavailable. */ }
  renderCollection();
  status.textContent = collected ? status.dataset.saved : status.dataset.removed;
});
