const loupe = document.querySelector('.loupe');
const loupeImage = document.querySelector('.loupe-image');
const loupeImg = loupeImage.querySelector('img');
const bulle = document.querySelector('.bulle');
const bulleTitre = document.querySelector('.bulle-titre');
const bulleDescription = document.querySelector('.bulle-description');

const progression = document.querySelector('.progression');
const progressionTexte = document.querySelector('.progression-texte');
const zones = document.querySelectorAll('.zone');
const zonesVues = new Set();

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

const LARGEUR_MAX = 30;
const HAUTEUR_MAX = 40;
const ZOOM_MAX = 3;

function afficherZone(zone) {
  const left = parseFloat(zone.style.left);
  const top = parseFloat(zone.style.top);
  const width = parseFloat(zone.style.width);
  const height = parseFloat(zone.style.height);

  const zoom = Math.min(LARGEUR_MAX / width, HAUTEUR_MAX / height, ZOOM_MAX);
  loupeImage.style.width = width * zoom + '%';
  loupeImage.style.height = height * zoom + '%';
  bulle.style.left = 2 + width * zoom + 2 + '%';

  const decalageX = ((left - 2) / (width * zoom)) * 100;
  const decalageY = ((top - 3) / (height * zoom)) * 100;
  loupeImage.style.setProperty(
    '--depart',
    `translate(${decalageX}%, ${decalageY}%) scale(${1 / zoom})`,
  );

  loupeImg.style.width = (100 / width) * 100 + '%';
  loupeImg.style.height = (100 / height) * 100 + '%';
  loupeImg.style.left = (-left / width) * 100 + '%';
  loupeImg.style.top = (-top / height) * 100 + '%';

  bulleTitre.textContent = zone.dataset.titre;
  bulleDescription.textContent = zone.dataset.description;
  loupe.classList.remove('fermeture');
  loupe.hidden = false;

  zonesVues.add(zone);
  majProgression((zonesVues.size / zones.length) * 100);
}

function fermerZone() {
  if (loupe.hidden || loupe.classList.contains('fermeture')) return;
  loupe.classList.add('fermeture');
  loupeImage.addEventListener(
    'animationend',
    () => {
      if (!loupe.classList.contains('fermeture')) return;
      loupe.classList.remove('fermeture');
      loupe.hidden = true;
    },
    { once: true },
  );
}

zones.forEach((zone) => {
  zone.addEventListener('click', () => afficherZone(zone));
});

document.querySelector('.bulle-fermer').addEventListener('click', fermerZone);

document.addEventListener('click', (event) => {
  if (loupe.hidden) return;
  if (event.target.closest('.bulle, .zone')) return;
  fermerZone();
});
