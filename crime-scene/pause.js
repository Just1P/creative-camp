const pause = document.querySelector('.pause');
const boutonSon = pause.querySelector('.pause-son');
const video = document.querySelector('.decor-video');
const sons = [musique, ambiance];
let sonsEnPause = [];

// ---------- Ouverture / fermeture ----------

function ouvrirPause() {
  pause.classList.add('ouvert');
  video.pause();
  sonsEnPause = sons.filter((son) => !son.paused);
  sonsEnPause.forEach((son) => son.pause());
}

function fermerPause() {
  pause.classList.remove('ouvert');
  video.play().catch(() => {});
  sonsEnPause.forEach((son) => son.play().catch(() => {}));
}

// Échap ferme d'abord ce qui est ouvert (zoom, digicode, fin) avant d'ouvrir la pause
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || e.repeat) return;
  if (pause.classList.contains('ouvert')) return fermerPause();
  if (fin.classList.contains('confirmation') && fin.classList.contains('ouvert')) {
    return fin.classList.remove('ouvert');
  }
  if (document.querySelector('.zoom.ouvert, .digicode.ouvert, .fin.ouvert')) return;
  ouvrirPause();
});

// ---------- Actions ----------

function majSon() {
  boutonSon.textContent = `Musique : ${musique.muted ? 'off' : 'on'}`;
}

boutonSon.addEventListener('click', () => {
  sons.forEach((son) => (son.muted = !son.muted));
  majSon();
});

const boutonPleinEcran = pause.querySelector('.pause-plein-ecran');

function majPleinEcran() {
  boutonPleinEcran.textContent = `Plein écran : ${estPleinEcran() ? 'on' : 'off'}`;
}

if (pleinEcranDisponible) {
  boutonPleinEcran.addEventListener('click', basculerPleinEcran);
  surChangementPleinEcran(majPleinEcran);
  majPleinEcran();
} else {
  boutonPleinEcran.remove();
}

document.querySelector('.bouton-pause').addEventListener('click', ouvrirPause);
pause.querySelector('.pause-reprendre').addEventListener('click', fermerPause);
pause.querySelector('.pause-quitter').addEventListener('click', () => {
  // Ouverte depuis le menu : on referme simplement le cadre du jeu pour garder le plein écran
  if (pageRacine !== window) pageRacine.fermerJeu();
  else location.href = '../main-menu/index.html';
});

majSon();
