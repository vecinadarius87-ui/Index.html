/* ============================================================
   NAVBAR — scroll shadow & hamburger toggle
============================================================ */
const navbar     = document.getElementById('navbar');
const burger     = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

burger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  const spans = burger.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ============================================================
   RESUME BUTTON
============================================================ */
document.getElementById('resumeBtn').addEventListener('click', () => {
  // TODO: Replace the showToastCustom call below with:
  // window.open('YOUR_PDF_URL_HERE', '_blank');
  showToastCustom('📄 Resume', 'Swap the URL in the code to your real PDF — it\'s ready!');
});

/* ============================================================
   TYPEWRITER EFFECT
============================================================ */
const roles = ['Full-Stack Programmer', 'UI/UX Designer', 'Tech Innovator'];
let rIdx = 0, cIdx = 0, deleting = false;
const tw = document.getElementById('typewriter');

function typeLoop() {
  const current = roles[rIdx];
  if (!deleting) {
    tw.textContent = current.slice(0, ++cIdx);
    if (cIdx === current.length) {
      setTimeout(() => { deleting = true; typeLoop(); }, 2200);
      return;
    }
    setTimeout(typeLoop, 60);
  } else {
    tw.textContent = current.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      rIdx = (rIdx + 1) % roles.length;
      setTimeout(typeLoop, 300);
      return;
    }
    setTimeout(typeLoop, 35);
  }
}
typeLoop();

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      if (e.target.classList.contains('skill-card')) {
        e.target.classList.add('in-view'); // triggers skill bar animation
      }
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   SKILLS TABS
============================================================ */
const tabBtns    = document.querySelectorAll('.tab-btn');
const skillGroups = document.querySelectorAll('.skill-group');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
    btn.classList.add('active'); btn.setAttribute('aria-selected','true');

    skillGroups.forEach(g => {
      g.classList.toggle('active', g.dataset.group === tab);
    });

    // Re-observe newly visible skill cards so bars animate in
    setTimeout(() => {
      document.querySelectorAll('.skill-group.active .skill-card').forEach(card => {
        if (!card.classList.contains('visible')) revealObserver.observe(card);
      });
    }, 50);
  });
});

/* ============================================================
   PROJECT CANVAS ILLUSTRATIONS
   Each canvas renders a unique themed background per project
============================================================ */
function drawCanvas(id, colorA, colorB, pattern) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 400;
  const H = canvas.offsetHeight || 225;
  canvas.width = W; canvas.height = H;

  // Dark gradient background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0d1413');
  bg.addColorStop(1, '#111a19');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = colorA; ctx.lineWidth = 1; ctx.globalAlpha = .15;

  if (pattern === 'grid') {
    // AcadTrack: dot grid
    for (let x = 0; x < W; x += 28) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 28) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  } else if (pattern === 'circuit') {
    // LogiRoute: circuit lines
    ctx.globalAlpha = .18;
    for (let i = 0; i < 10; i++) {
      const x = Math.random()*W, y = Math.random()*H;
      ctx.beginPath(); ctx.moveTo(x,y);
      ctx.lineTo(x + 40*(Math.random()-.5), y);
      ctx.lineTo(x + 40*(Math.random()-.5), y + 40*(Math.random()-.5));
      ctx.stroke();
    }
  } else {
    // Appaholics: concentric arcs
    ctx.globalAlpha = .1;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(W*Math.random(), H*Math.random(), 10+Math.random()*40, 0, Math.PI*2);
      ctx.stroke();
    }
  }

  ctx.globalAlpha = 1;

  // Radial glow blob
  const grad = ctx.createRadialGradient(W*.35, H*.45, 0, W*.35, H*.45, W*.38);
  grad.addColorStop(0, colorA + '28');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);

  // Project label
  ctx.font = `700 ${W > 300 ? 28 : 20}px 'Space Grotesk', sans-serif`;
  ctx.fillStyle = colorA;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const labels = { canvas1: 'AcadTrack', canvas2: 'LogiRoute DB', canvas3: 'Appaholics UI' };
  ctx.fillText(labels[id] || '', W/2, H/2);

  ctx.font = `400 12px 'JetBrains Mono', monospace`;
  ctx.fillStyle = colorB;
  ctx.fillText('// tap to explore', W/2, H/2 + 36);
}

function initCanvases() {
  drawCanvas('canvas1', '#00e5a0', '#3fd4f4', 'grid');      // AcadTrack — emerald grid
  drawCanvas('canvas2', '#3fd4f4', '#00e5a0', 'circuit');   // LogiRoute — blue circuits
  drawCanvas('canvas3', '#a78bfa', '#00e5a0', 'circle');    // Appaholics — purple arcs
}

window.addEventListener('load',   initCanvases);
window.addEventListener('resize', initCanvases);

/* ============================================================
   PROJECT BUTTON HANDLER
   Replace the toast message with real URLs when ready
============================================================ */
function projectAlert(name, type) {
  const msgs = {
    source: `GitHub repo for "${name}" — add your repository URL here.`,
    demo:   `Live demo for "${name}" — add your deployed URL here.`,
    figma:  `Figma file for "${name}" — add your Figma share link here.`,
  };
  showToastCustom('🔗 ' + name, msgs[type]);
}

/* ============================================================
   CONTACT FORM — client-side validation
============================================================ */
const form = document.getElementById('contactForm');

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function setError(inputId, errId, show) {
  document.getElementById(inputId).classList.toggle('error', show);
  document.getElementById(errId).classList.toggle('show', show);
  return !show;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const fname   = document.getElementById('fname').value.trim();
  const lname   = document.getElementById('lname').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  let valid = true;
  valid = setError('fname',   'fname-err',   !fname)               && valid;
  valid = setError('lname',   'lname-err',   !lname)               && valid;
  valid = setError('email',   'email-err',   !validateEmail(email)) && valid;
  valid = setError('subject', 'subject-err', !subject)             && valid;
  valid = setError('message', 'message-err', message.length < 20)  && valid;

  if (!valid) return;

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 8l11-5-5 11-1.5-5.5L2 8z"/></svg> Send Message`;
    form.reset();
    showToast();
  }, 1200);
});

// Live clear errors on input
['fname','lname','email','subject','message'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById(id).classList.remove('error');
    document.getElementById(id + '-err').classList.remove('show');
  });
});

/* ============================================================
   TOAST NOTIFICATION SYSTEM
============================================================ */
let toastTimer;
const toast = document.getElementById('toast');

function showToast() {
  toast.querySelector('.toast-title').textContent = 'Message Sent!';
  toast.querySelector('.toast-sub').textContent   = "Thanks — I'll get back to you shortly.";
  triggerToast();
}

function showToastCustom(title, sub) {
  toast.querySelector('.toast-title').textContent = title;
  toast.querySelector('.toast-sub').textContent   = sub;
  triggerToast();
}

function triggerToast() {
  clearTimeout(toastTimer);
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
}
