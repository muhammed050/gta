const releaseDate = new Date('2026-11-19T00:00:00+03:00').getTime();
const launchWindowStart = new Date('2025-11-06T00:00:00+03:00').getTime();

const $ = (id) => document.getElementById(id);

function pad(value, length = 2) {
  return String(value).padStart(length, '0');
}

function updateCountdown() {
  const now = Date.now();
  const distance = releaseDate - now;

  if (distance <= 0) {
    $('days').textContent = '000';
    $('hours').textContent = '00';
    $('minutes').textContent = '00';
    $('seconds').textContent = '00';
    $('progress').style.width = '100%';
    const hint = document.querySelector('.tiny');
    if (hint) hint.textContent = 'GTA VI is here 🎉';
    return;
  }

  const totalSeconds = Math.floor(distance / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  $('days').textContent = pad(days, 3);
  $('hours').textContent = pad(hours);
  $('minutes').textContent = pad(minutes);
  $('seconds').textContent = pad(seconds);

  const elapsed = Math.max(0, now - launchWindowStart);
  const total = releaseDate - launchWindowStart;
  $('progress').style.width = `${Math.min(100, (elapsed / total) * 100)}%`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Lightweight parallax.
const hero = document.querySelector('.hero');
if (hero) {
  window.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 10;
    const y = (event.clientY / window.innerHeight - 0.5) * 8;
    hero.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
  }, { passive: true });
}

// Better ad layout: reserved-height slots reduce CLS and keep ads away from the countdown.
function createAdSlot(id, label) {
  const section = document.createElement('section');
  section.className = 'ad-slot';
  section.id = id;
  section.setAttribute('aria-label', 'Advertisement');
  section.innerHTML = `<div class="ad-inner"><span>${label}</span><div class="ad-content" data-ad-slot="${id}"></div></div>`;
  return section;
}

const heroSection = document.querySelector('.hero');
const gallerySection = document.querySelector('#gallery');
const aboutSection = document.querySelector('#about');
if (heroSection && gallerySection) {
  gallerySection.before(createAdSlot('ad-top', 'ADVERTISEMENT'));
}
if (gallerySection && aboutSection) {
  aboutSection.before(createAdSlot('ad-middle', 'ADVERTISEMENT'));
}

// SEO: structured data for the countdown page. No claim of being an official Rockstar site.
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'GTA VI Countdown',
  description: 'Live countdown to the release of Grand Theft Auto VI.',
  url: window.location.origin + window.location.pathname,
  inLanguage: ['en', 'ar'],
  potentialAction: {
    '@type': 'SearchAction',
    target: window.location.origin + window.location.pathname + '?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};
const ld = document.createElement('script');
ld.type = 'application/ld+json';
ld.textContent = JSON.stringify(structuredData);
document.head.appendChild(ld);

// Image SEO/performance safeguards.
document.querySelectorAll('.gallery-grid img').forEach((img) => {
  img.loading = 'lazy';
  img.decoding = 'async';
  img.setAttribute('fetchpriority', 'low');
});
const heroImage = document.querySelector('.hero-image img');
if (heroImage) {
  heroImage.loading = 'eager';
  heroImage.decoding = 'async';
  heroImage.setAttribute('fetchpriority', 'high');
}

// Ad slot styling is injected here so the static page needs no extra dependency.
const adStyle = document.createElement('style');
adStyle.textContent = `
.ad-slot{min-height:122px;padding:22px 7vw;background:#09070d;display:flex;align-items:center;justify-content:center;border-top:1px solid rgba(255,255,255,.045);border-bottom:1px solid rgba(255,255,255,.045)}
.ad-inner{width:min(970px,100%);min-height:76px;border:1px solid rgba(255,255,255,.075);border-radius:16px;background:rgba(255,255,255,.018);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.ad-inner>span{position:absolute;top:8px;left:50%;transform:translateX(-50%);font:600 9px/1 Arial,sans-serif;letter-spacing:2px;color:#625b65;white-space:nowrap}
.ad-content{width:100%;min-height:70px}
@media(max-width:600px){.ad-slot{min-height:105px;padding:16px 5vw}.ad-inner{min-height:70px;border-radius:12px}}
`;
document.head.appendChild(adStyle);
`;
