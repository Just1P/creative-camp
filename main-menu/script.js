document
  .querySelectorAll('[data-href]')
  .forEach((btn) => btn.addEventListener('click', () => (window.location.href = btn.dataset.href)));

const music = document.querySelector('.musique');
const trailer = document.querySelector('.trailer');
const video = trailer.querySelector('.trailer__video');

function openTrailer() {
  trailer.classList.add('is-open');
  trailer.setAttribute('aria-hidden', 'false');
  music.pause();
  video.currentTime = 0;
  video.play();
}

function closeTrailer() {
  trailer.classList.remove('is-open');
  trailer.setAttribute('aria-hidden', 'true');
  video.pause();
  music.play().catch(() => {});
}

document.querySelector('[data-open-trailer]').addEventListener('click', openTrailer);
trailer
  .querySelectorAll('[data-close-trailer]')
  .forEach((el) => el.addEventListener('click', closeTrailer));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && trailer.classList.contains('is-open')) closeTrailer();
});

// Musique du menu : le navigateur bloque le son avant la première interaction
music.volume = 0.5;

function startMusic() {
  if (trailer.classList.contains('is-open')) return;
  music
    .play()
    .then(() => ['pointerdown', 'keydown'].forEach((type) => document.removeEventListener(type, startMusic)))
    .catch(() => {});
}

startMusic();
['pointerdown', 'keydown'].forEach((type) => document.addEventListener(type, startMusic));

// Parallaxe du décor et halo lumineux sur le titre
const scene = document.querySelector('.scene');
let targetX = 0,
  targetY = 0,
  currentX = 0,
  currentY = 0;

document.addEventListener('mousemove', (e) => {
  targetX = -(e.clientX / window.innerWidth - 0.5) * 2;
  targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
});

const titles = document.querySelector('.titles');
titles.addEventListener('mousemove', (e) => {
  titles.querySelectorAll('h1').forEach((title) => {
    const rect = title.getBoundingClientRect();
    title.style.setProperty('--lx', `${e.clientX - rect.left}px`);
    title.style.setProperty('--ly', `${e.clientY - rect.top}px`);
  });
});

const rand = (min, max) => min + Math.random() * (max - min);

function glitchTitle() {
  const h1s = titles.querySelectorAll('h1');
  const targets = Math.random() < 0.3 ? [...h1s] : [h1s[Math.floor(Math.random() * h1s.length)]];
  targets.forEach((title) => {
    [1, 2].forEach((i) => {
      const top = rand(5, 80);
      title.style.setProperty(`--g${i}-top`, `${top}%`);
      title.style.setProperty(`--g${i}-bottom`, `${100 - top - rand(5, 18)}%`);
      const x = rand(6, 14) * (Math.random() < 0.5 ? -1 : 1);
      title.style.setProperty(`--g${i}-x`, `${x.toFixed(1)}px`);
    });
    title.style.setProperty('--g-jitter', `${rand(-3, 3).toFixed(1)}px`);
    title.classList.remove('is-glitching');
    void title.offsetWidth;
    title.classList.add('is-glitching');
  });
  setTimeout(glitchTitle, rand(600, 3500));
}

titles
  .querySelectorAll('h1')
  .forEach((title) =>
    title.addEventListener('animationend', () => title.classList.remove('is-glitching')),
  );
setTimeout(glitchTitle, rand(300, 1500));

function animateBg() {
  currentX += (targetX - currentX) * 0.05;
  currentY += (targetY - currentY) * 0.05;
  scene.style.setProperty('--mx', currentX.toFixed(4));
  scene.style.setProperty('--my', currentY.toFixed(4));
  requestAnimationFrame(animateBg);
}
animateBg();
