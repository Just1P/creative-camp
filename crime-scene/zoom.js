const zoom = document.querySelector('.zoom');
const zoomObjet = zoom.querySelector('.zoom-objet');
const zoomImage = zoom.querySelector('.zoom-image');
const DUREE_AVANT_DEZOOM = 1800;
let zoneZoom = null;
let zoomBloque = false;

// ---------- Ouverture / fermeture ----------

// Le zoom part de l'objet dans le décor et y revient à la fermeture
function placerDepart(origine) {
  const cadre = zoom.getBoundingClientRect();
  const objet = origine.getBoundingClientRect();
  const x = objet.left + objet.width / 2 - (cadre.left + cadre.width / 2);
  const y = objet.top + objet.height / 2 - (cadre.top + cadre.height / 2);
  zoomObjet.style.setProperty('--depart-x', x + 'px');
  zoomObjet.style.setProperty('--depart-y', y + 'px');
  zoomObjet.style.setProperty('--depart-echelle', objet.height / zoomObjet.offsetHeight);
  // Applique la position de départ avant de lancer la transition
  getComputedStyle(zoomObjet).transform;
}

function ouvrirZoom(zone, origine) {
  zoneZoom = zone;
  placerDepart(origine);
  zoomBloque = false;
  zoomImage.src = zone.imageZoom;
  zoomImage.alt = zone.titre;
  // Préchargée pour éviter un clignement au moment de prendre l'objet
  if (zone.imageZoomRecuperee) new Image().src = zone.imageZoomRecuperee;
  zoom.classList.add('ouvert');
}

function fermerZoom() {
  zoom.classList.remove('ouvert');
  zoneZoom = null;
}

// ---------- Récupération ----------

zoomObjet.addEventListener('click', () => {
  if (zoomBloque) return;
  zoomBloque = true;
  const zone = zoneZoom;
  if (zone.imageZoomRecuperee) zoomImage.src = zone.imageZoomRecuperee;
  afficherZone(zone);
  setTimeout(fermerZoom, DUREE_AVANT_DEZOOM);
});

// Clic à côté de l'objet pour quitter sans rien prendre
zoom.addEventListener('click', (e) => {
  if (!zoomBloque && e.target === zoom) fermerZoom();
});

document.addEventListener('keydown', (e) => {
  if (zoneZoom && e.key === 'Escape' && !zoomBloque) fermerZoom();
});
