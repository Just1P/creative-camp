const music = document.querySelector('.musique');
const trailer = document.querySelector('.trailer');
const video = trailer.querySelector('.trailer__video');
const fondMenu = document.querySelector('.scene__bg');

// Le jeu s'ouvre dans un cadre par-dessus le menu : changer de page ferait sortir du plein écran
let cadreJeu = null;

function ouvrirJeu(url) {
  if (cadreJeu) return;
  cadreJeu = document.createElement('iframe');
  cadreJeu.className = 'jeu';
  cadreJeu.src = url;
  cadreJeu.allow = 'autoplay; fullscreen';
  cadreJeu.addEventListener('load', () => cadreJeu.focus());
  document.body.append(cadreJeu);
  music.pause();
  fondMenu.pause();
}

// Appelée par la scène de crime (bouton « Menu principal » de la pause)
function fermerJeu() {
  if (!cadreJeu) return;
  cadreJeu.remove();
  cadreJeu = null;
  fondMenu.play().catch(() => {});
  if (soundOn) music.play().catch(() => {});
}

document
  .querySelectorAll('[data-href]')
  .forEach((btn) => btn.addEventListener('click', () => ouvrirJeu(btn.dataset.href)));

// Bouton plein écran dans le coin haut droit
if (pleinEcranDisponible) {
  const ICONE_ENTRER = 'M0 0h3v1H1v2H0zM4 0h3v3H6V1H4zM0 4h1v2h2v1H0zM6 4h1v3H4V6h2z';
  const ICONE_SORTIR = 'M2 0h1v3H0V2h2zM4 0h1v2h2v1H4zM0 4h3v3H2V5H0zM4 4h3v1H5v2H4z';
  const boutonPleinEcran = document.createElement('button');
  boutonPleinEcran.type = 'button';
  boutonPleinEcran.className = 'plein-ecran';
  boutonPleinEcran.innerHTML = '<svg viewBox="0 0 7 7" aria-hidden="true"><path /></svg>';
  document.body.append(boutonPleinEcran);

  const majPleinEcran = () => {
    const actif = estPleinEcran();
    boutonPleinEcran.querySelector('path').setAttribute('d', actif ? ICONE_SORTIR : ICONE_ENTRER);
    boutonPleinEcran.setAttribute('aria-label', actif ? 'Quitter le plein écran' : 'Plein écran');
  };
  boutonPleinEcran.addEventListener('click', basculerPleinEcran);
  surChangementPleinEcran(majPleinEcran);
  majPleinEcran();
}

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
  if (soundOn) music.play().catch(() => {});
}

document.querySelector('[data-open-trailer]').addEventListener('click', openTrailer);
trailer
  .querySelectorAll('[data-close-trailer]')
  .forEach((el) => el.addEventListener('click', closeTrailer));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && trailer.classList.contains('is-open')) closeTrailer();
});

// Musique du menu : coupée par défaut, le bouton « musique » l'active ou la coupe
music.volume = 0.5;
const soundToggle = document.querySelector('.sound-toggle');
let soundOn = false;

function setSound(on) {
  soundOn = on;
  soundToggle.textContent = soundToggle.dataset.text = `musique : ${on ? 'on' : 'off'}`;
  if (!on) music.pause();
  else if (!trailer.classList.contains('is-open')) music.play().catch(() => setSound(false));
}

soundToggle.addEventListener('click', () => setSound(!soundOn));

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
