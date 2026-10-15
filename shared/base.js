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
const docRacine = pageRacine.document;
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
