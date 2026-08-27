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
    document.querySelector('.tiny').textContent = 'وصلنا إلى يوم الإطلاق 🎉';
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

// Subtle parallax movement for the neon sun.
const hero = document.querySelector('.hero');
window.addEventListener('pointermove', (event) => {
  const x = (event.clientX / window.innerWidth - 0.5) * 10;
  const y = (event.clientY / window.innerHeight - 0.5) * 8;
  hero.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
});
