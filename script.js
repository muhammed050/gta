const RELEASE_DATE = new Date('2026-11-19T00:00:00+03:00').getTime();
const COUNTDOWN_START = new Date('2025-11-06T00:00:00+03:00').getTime();

const $ = (id) => document.getElementById(id);

function pad(value, length = 2) {
  return String(Math.max(0, value)).padStart(length, '0');
}

function updateCountdown() {
  const now = Date.now();
  const remaining = Math.max(0, RELEASE_DATE - now);

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const daysEl = $('days');
  const hoursEl = $('hours');
  const minutesEl = $('minutes');
  const secondsEl = $('seconds');
  const progressEl = $('progress');

  if (daysEl) daysEl.textContent = pad(days, 3);
  if (hoursEl) hoursEl.textContent = pad(hours);
  if (minutesEl) minutesEl.textContent = pad(minutes);
  if (secondsEl) secondsEl.textContent = pad(seconds);

  if (progressEl) {
    const total = RELEASE_DATE - COUNTDOWN_START;
    const elapsed = Math.max(0, Math.min(total, now - COUNTDOWN_START));
    progressEl.style.width = `${total > 0 ? (elapsed / total) * 100 : 0}%`;
  }

  const hint = document.querySelector('.tiny');
  if (hint && remaining <= 0) {
    hint.textContent = document.documentElement.lang === 'ar'
      ? 'وصلنا إلى يوم الإطلاق 🎉'
      : 'GTA VI is here 🎉';
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Lightweight mouse parallax, disabled for touch devices.
const hero = document.querySelector('.hero');
if (hero && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 8;
    const y = (event.clientY / window.innerHeight - 0.5) * 6;
    hero.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
  }, { passive: true });
}

// Reserve clean, non-intrusive ad areas between content sections.
function createAdSlot(id) {
  const section = document.createElement('section');
  section.className = 'ad-slot';
  section.id = id;
  section.setAttribute('aria-label', 'Advertisement');
  section.innerHTML = `
    <div class="ad-inner">
      <span>ADVERTISEMENT</span>
      <div class="ad-content" data-ad-slot="${id}"></div>
    </div>
  `;
  return section;
}

const gallerySection = document.querySelector('#gallery');
const aboutSection = document.querySelector('#about');
if (gallerySection) gallerySection.before(createAdSlot('ad-top'));
if (aboutSection) aboutSection.before(createAdSlot('ad-middle'));

// Add structured data without falsely presenting this fan page as official.
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'GTA VI Countdown',
  description: 'A fan-made live countdown to Grand Theft Auto VI.',
  url: window.location.origin + window.location.pathname,
  inLanguage: ['en', 'ar']
};

const ld = document.createElement('script');
ld.type = 'application/ld+json';
ld.textContent = JSON.stringify(structuredData);
document.head.appendChild(ld);

// Image performance hints.
document.querySelectorAll('.gallery-grid img').forEach((img) => {
  img.loading = 'lazy';
  img.decoding = 'async';
});

const heroImage = document.querySelector('.hero-image img');
if (heroImage) {
  heroImage.loading = 'eager';
  heroImage.fetchPriority = 'high';
  heroImage.decoding = 'async';
}

// Ad styling with reserved space to reduce layout shift.
const adStyle = document.createElement('style');
adStyle.textContent = `
.ad-slot{min-height:122px;padding:22px 7vw;background:#09070d;display:flex;align-items:center;justify-content:center;border-top:1px solid rgba(255,255,255,.045);border-bottom:1px solid rgba(255,255,255,.045)}
.ad-inner{width:min(970px,100%);min-height:76px;border:1px solid rgba(255,255,255,.075);border-radius:16px;background:rgba(255,255,255,.018);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.ad-inner>span{position:absolute;top:8px;left:50%;transform:translateX(-50%);font:600 9px/1 Arial,sans-serif;letter-spacing:2px;color:#625b65;white-space:nowrap}
.ad-content{width:100%;min-height:70px}
@media(max-width:600px){.ad-slot{min-height:105px;padding:16px 5vw}.ad-inner{min-height:70px;border-radius:12px}}
`;
document.head.appendChild(adStyle);
