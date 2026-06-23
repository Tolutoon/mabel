// Stars
const starsEl = document.getElementById('stars');
for (let i = 0; i < 40; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  s.style.left = Math.random() * 100 + '%';
  s.style.top  = Math.random() * 100 + '%';
  s.style.animationDuration = (2 + Math.random() * 4) + 's';
  s.style.animationDelay   = (Math.random() * 5) + 's';
  starsEl.appendChild(s);
}

// Floating hearts
const hBg = document.getElementById('hearts-bg');
const heartEmojis = ['💕', '💗', '💖', '💝', '🌸', '✨', '💓', '🌷'];

function spawnHeart() {
  const h = document.createElement('div');
  h.className = 'heart-float';
  h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  h.style.left = Math.random() * 100 + '%';
  const dur = 6 + Math.random() * 8;
  h.style.animationDuration = dur + 's';
  h.style.animationDelay   = Math.random() * 3 + 's';
  h.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
  hBg.appendChild(h);
  setTimeout(() => h.remove(), (dur + 3) * 1000);
}
setInterval(spawnHeart, 700);

// Screen transitions
function show(id) {
  ['envelope-screen', 'letter-screen', 'question-screen', 'answer-screen'].forEach(s => {
    const el = document.getElementById(s);
    el.style.display = 'none';
    el.style.animation = 'none';
  });
  const el = document.getElementById(id);
  el.style.display = 'flex';
  el.offsetHeight; // reflow
  el.style.animation = 'fadeIn 1s ease forwards';
}

function openLetter()   { show('letter-screen'); }
function showQuestion() { show('question-screen'); initNoButton(); }

// No button runs away
let noCount = 0;
const noLabels = [
  'No', 'Are you sure?', 'Really??', 'Think again 🥺',
  'Pls say yes 😢', 'Last chance!', '...still no?', 'Ok fine... jk say YES 💕'
];

function runAway(btn) {
  noCount++;
  const vw = window.innerWidth  - btn.offsetWidth  - 20;
  const vh = window.innerHeight - btn.offsetHeight - 20;
  btn.style.position = 'fixed';
  btn.style.left = Math.max(0, Math.random() * vw) + 'px';
  btn.style.top  = Math.max(0, Math.random() * vh) + 'px';
  btn.style.zIndex = 1000;
  btn.textContent = noLabels[Math.min(noCount, noLabels.length - 1)];
}

// Wire up touch support for the No button after question screen loads
function initNoButton() {
  const btn = document.getElementById('noBtn');
  if (!btn) return;
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    runAway(btn);
  }, { passive: false });
}

// Yes!
function sayYes() {
  show('answer-screen');
  launchFireworks();
}

// Fireworks
function launchFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  canvas.style.display = 'block';
  const ctx = canvas.getContext('2d');
  canvas.width  = window.visualViewport ? window.visualViewport.width  : window.innerWidth;
  canvas.height = window.visualViewport ? window.visualViewport.height : window.innerHeight;

  const particles = [];

  function createBurst(x, y) {
    const colors = ['#ff69b4', '#ff1493', '#ffec00', '#ffffff', '#ff6eb4', '#ffc0cb'];
    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 / 60) * i;
      const speed = 2 + Math.random() * 4;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: 2 + Math.random() * 2
      });
    }
  }

  let bursts = 0;
  const burstInterval = setInterval(() => {
    createBurst(Math.random() * canvas.width, Math.random() * canvas.height * 0.7);
    bursts++;
    if (bursts >= 12) clearInterval(burstInterval);
  }, 350);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.05;
      p.alpha -= 0.012;
      if (p.alpha <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (particles.length > 0 || bursts < 12) requestAnimationFrame(animate);
    else canvas.style.display = 'none';
  }
  animate();
}
