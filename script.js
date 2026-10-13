const progression = document.querySelector('.progression');
const progressionTexte = document.querySelector('.progression-texte');
const zones = document.querySelectorAll('.zone');
const zonesVues = new Set();

const inventaire = document.querySelector('.inventaire');
const inventaireMessage = document.querySelector('.inventaire-message');
const cases = inventaire.querySelectorAll('.case');
const preuvesRecuperees = new Set();
const DUREE_INVENTAIRE = 2500;
let fermetureInventaire;

const canvas = progression.querySelector('canvas');
const ctx = canvas.getContext('2d');
const TAILLE = canvas.width;
const RAYON_EXT = TAILLE / 2 - 1;
const RAYON_INT = RAYON_EXT - 6;
const RAYON_EXT_FOND = RAYON_EXT - 2;
const RAYON_INT_FOND = RAYON_INT - 2;
const COULEUR_BARRE = [236, 47, 91, 255];
const COULEUR_FOND = [255, 255, 255, 20];
const DUREE_ANIMATION = 600;

let valeurAffichee = 0;
let animation;

// Dessine l'anneau pixel par pixel pour garder des bords nets une fois agrandi
function dessinerProgression(pourcentage) {
  const image = ctx.createImageData(TAILLE, TAILLE);
  const centre = TAILLE / 2;
  for (let y = 0; y < TAILLE; y++) {
    for (let x = 0; x < TAILLE; x++) {
      const dx = x + 0.5 - centre;
      const dy = y + 0.5 - centre;
      const distance = Math.hypot(dx, dy);
      if (distance > RAYON_EXT || distance < RAYON_INT) continue;
      // Angle de 0 à 100, en partant du haut dans le sens horaire
      const angle = ((Math.atan2(dx, -dy) / (2 * Math.PI)) * 100 + 100) % 100;
      if (angle < pourcentage) {
        image.data.set(COULEUR_BARRE, (y * TAILLE + x) * 4);
      } else if (distance <= RAYON_EXT_FOND && distance >= RAYON_INT_FOND) {
        image.data.set(COULEUR_FOND, (y * TAILLE + x) * 4);
      }
    }
  }
  ctx.putImageData(image, 0, 0);
}

function majProgression(pourcentage) {
  const valeur = Math.round(Math.max(0, Math.min(100, pourcentage)));
  progression.setAttribute('aria-valuenow', valeur);
  progressionTexte.textContent = valeur + '%';

  const depart = valeurAffichee;
  const debut = performance.now();
  cancelAnimationFrame(animation);
  const etape = (maintenant) => {
    const t = Math.min(1, (maintenant - debut) / DUREE_ANIMATION);
    valeurAffichee = depart + (valeur - depart) * (1 - (1 - t) ** 3);
    dessinerProgression(valeurAffichee);
    if (t < 1) animation = requestAnimationFrame(etape);
  };
  animation = requestAnimationFrame(etape);
}

dessinerProgression(0);

// Range la preuve dans la première case libre, puis rentre l'inventaire
function ajouterPreuve(zone) {
  if (preuvesRecuperees.has(zone)) return;
  const caseLibre = [...cases].find((c) => !c.firstElementChild);
  if (!caseLibre) return;
  preuvesRecuperees.add(zone);

  let item;
  if (zone.dataset.image) {
    item = document.createElement('img');
    item.src = zone.dataset.image;
    item.alt = zone.dataset.titre;
  } else {
    item = document.createElement('span');
    item.textContent = zone.dataset.titre;
  }
  caseLibre.append(item);
  cases.forEach((c) => c.classList.toggle('nouvelle', c === caseLibre));

  inventaireMessage.textContent = zone.dataset.preuve;
  inventaire.classList.add('ouvert');
  clearTimeout(fermetureInventaire);
  fermetureInventaire = setTimeout(() => {
    inventaire.classList.remove('ouvert');
  }, DUREE_INVENTAIRE);
}

function afficherZone(zone) {
  zonesVues.add(zone);
  majProgression((zonesVues.size / zones.length) * 100);

  if (zone.dataset.preuve) ajouterPreuve(zone);
}

zones.forEach((zone) => {
  zone.addEventListener('click', () => afficherZone(zone));
});
