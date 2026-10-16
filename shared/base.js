// Désactive la navigation au clavier avec Tab : aucun élément ne doit être sélectionné
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') e.preventDefault();
});

// ---------- Plein écran ----------

// La scène de crime s'ouvre dans un cadre par-dessus le menu (voir main-menu/script.js) :
// le plein écran s'applique toujours à la page du menu pour ne pas le perdre en jouant.
function trouverPageRacine() {
  try {
    if (typeof window.parent.fermerJeu === 'function') return window.parent;
  } catch {}
  return window;
}

const pageRacine = trouverPageRacine();

// Prévient le menu dès que la page est construite, sans attendre vidéos et sons (event load)
if (pageRacine !== window) {
  document.addEventListener('DOMContentLoaded', () => pageRacine.jeuPret?.());
}
const docRacine = pageRacine.document;

// ---------- Mobile ----------

// Écran tactile : pas de souris, donc ni survol ni parallaxe
const ecranTactile = matchMedia('(pointer: coarse)').matches;

// Message « tournez votre téléphone », affiché en CSS quand l'écran est à la verticale.
// Seulement sur la page racine : il couvre déjà la scène ouverte dans le cadre du jeu.
if (pageRacine === window) {
  const tourner = document.createElement('div');
  tourner.className = 'tourner';
  tourner.innerHTML =
    '<svg viewBox="0 0 7 11" aria-hidden="true"><path fill-rule="evenodd" d="M0 0h7v11H0zM1 1v7h5V1zM3 9h1v1H3z" /></svg>' +
    '<p>Tournez votre téléphone pour jouer</p>';
  document.body.append(tourner);
}
const pleinEcranDisponible = Boolean(docRacine.fullscreenEnabled || docRacine.webkitFullscreenEnabled);

function estPleinEcran() {
  return Boolean(docRacine.fullscreenElement || docRacine.webkitFullscreenElement);
}

function basculerPleinEcran() {
  if (estPleinEcran()) {
    (docRacine.exitFullscreen || docRacine.webkitExitFullscreen).call(docRacine);
    return;
  }
  const racine = docRacine.documentElement;
  const demande = racine.requestFullscreen || racine.webkitRequestFullscreen;
  // Sur Chrome, Échap ouvre la pause au lieu de quitter le plein écran (appui long pour sortir)
  Promise.resolve(demande.call(racine))
    .then(() => pageRacine.navigator.keyboard?.lock?.(['Escape']))
    .catch(() => {});
}

// Écouteurs retirés à la fermeture de la page (le cadre du jeu est supprimé, pas le menu)
const finDePage = new AbortController();
window.addEventListener('pagehide', () => finDePage.abort());

function surChangementPleinEcran(callback) {
  ['fullscreenchange', 'webkitfullscreenchange'].forEach((type) =>
    docRacine.addEventListener(type, callback, { signal: finDePage.signal }),
  );
}
