const loupe = document.querySelector('.loupe');
const loupeImage = document.querySelector('.loupe-image');
const loupeImg = loupeImage.querySelector('img');
const bulle = document.querySelector('.bulle');
const bulleTitre = document.querySelector('.bulle-titre');
const bulleDescription = document.querySelector('.bulle-description');

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

  loupeImg.style.width = (100 / width) * 100 + '%';
  loupeImg.style.height = (100 / height) * 100 + '%';
  loupeImg.style.left = (-left / width) * 100 + '%';
  loupeImg.style.top = (-top / height) * 100 + '%';

  bulleTitre.textContent = zone.dataset.titre;
  bulleDescription.textContent = zone.dataset.description;
  loupe.hidden = false;
}

document.querySelectorAll('.zone').forEach((zone) => {
  zone.addEventListener('click', () => afficherZone(zone));
});

document.querySelector('.bulle-fermer').addEventListener('click', () => {
  loupe.hidden = true;
});
