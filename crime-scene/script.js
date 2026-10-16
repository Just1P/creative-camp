const scene = document.querySelector('.scene');
const decor = document.querySelector('.decor');
const listeObjectifs = document.querySelector('.objectifs-liste');
const zonesVues = new Set();

const inventaire = document.querySelector('.inventaire');
const inventaireMessage = document.querySelector('.inventaire-message');
const cases = inventaire.querySelectorAll('.case');
const boutonInventaire = document.querySelector('.inventaire-bouton');
const zoneCases = inventaire.querySelector('.inventaire-cases');
const preuvesRecuperees = new Set();
const DUREE_INVENTAIRE = 2500;
const DELAI_LETTRE = 30;
let fermetureInventaire;
let ecriture;
let fermetureEnAttente = false;

// ---------- Objectifs ----------

const OBJECTIFS = [
  {
    nom: 'Indices',
    total: ZONES.filter((zone) => zone.preuve).length,
    compte: () => preuvesRecuperees.size,
  },
  {
    nom: 'Zones inspectées',
    total: ZONES.length,
    compte: () => zonesVues.size,
  },
];

function majObjectifs() {
  listeObjectifs.replaceChildren(
    ...OBJECTIFS.map((objectif) => {
      const compte = objectif.compte();
      const ligne = document.createElement('li');
      ligne.className = 'objectif';
      ligne.classList.toggle('termine', compte >= objectif.total);

      const nom = document.createElement('span');
      nom.textContent = objectif.nom;
      const valeur = document.createElement('span');
      valeur.className = 'objectif-compte';
      valeur.textContent = compte + '/' + objectif.total;

      ligne.append(nom, valeur);
      return ligne;
    }),
  );
  boutonTerminer.classList.toggle('visible', preuvesRecuperees.size >= OBJECTIFS[0].total);
}

// ---------- Fin de l'enquête ----------

const boutonTerminer = document.querySelector('.terminer');
const fin = document.querySelector('.fin');
const finTexte = fin.querySelector('.fin-confirmation .fin-texte');

function afficherFin(etape) {
  fin.classList.remove('confirmation', 'merci');
  fin.classList.add('ouvert', etape);
}

boutonTerminer.addEventListener('click', () => {
  const restantes = ZONES.length - zonesVues.size;
  if (restantes === 0) return afficherFin('merci');
  finTexte.textContent =
    restantes === 1
      ? 'Il reste 1 zone que vous n’avez pas inspectée.'
      : `Il reste ${restantes} zones que vous n’avez pas inspectées.`;
  afficherFin('confirmation');
});

fin.querySelector('.fin-annuler').addEventListener('click', () => fin.classList.remove('ouvert'));
fin.querySelector('.fin-valider').addEventListener('click', () => afficherFin('merci'));

majObjectifs();

// ---------- Inventaire ----------

function ecrireMessage(message, finie) {
  const ecrit = document.createElement('span');
  const reste = document.createElement('span');
  reste.className = 'inventaire-message-reste';
  reste.textContent = message;
  inventaireMessage.replaceChildren(ecrit, reste);
  inventaireMessage.setAttribute('aria-label', message);

  const lettres = [...message];
  let i = 0;
  clearInterval(ecriture);
  ecriture = setInterval(() => {
    i++;
    ecrit.textContent = lettres.slice(0, i).join('');
    reste.textContent = lettres.slice(i).join('');
    if (i >= lettres.length) {
      clearInterval(ecriture);
      finie();
    }
  }, DELAI_LETTRE);
}

function ouvrirInventaire(message, avecCases) {
  inventaire.classList.remove('sans-message', 'manuel', 'recuperation');
  inventaire.classList.toggle('sans-cases', !avecCases);
  inventaire.classList.add('ouvert');
  clearTimeout(fermetureInventaire);
  fermetureEnAttente = false;
  ecrireMessage(message, () => {
    fermetureInventaire = setTimeout(fermerInventaireAuto, DUREE_INVENTAIRE);
  });
}

function fermerInventaire() {
  fermetureEnAttente = false;
  inventaire.classList.remove('ouvert', 'manuel', 'recuperation');
  cases.forEach((c) => c.classList.remove('montre'));
}

// Fermeture automatique repoussée tant que la souris est sur les cases (ou qu'une fiche est ouverte au toucher)
function fermerInventaireAuto() {
  const consultee = zoneCases.matches(':hover') || zoneCases.querySelector('.montre');
  if (!inventaire.classList.contains('sans-cases') && consultee) {
    fermetureEnAttente = true;
    return;
  }
  fermerInventaire();
}

zoneCases.addEventListener('mouseleave', () => {
  if (fermetureEnAttente) fermerInventaire();
});

const observateurInventaire = new MutationObserver(() => {
  const ouvert =
    inventaire.classList.contains('ouvert') && !inventaire.classList.contains('sans-cases');
  boutonInventaire.setAttribute(
    'aria-label',
    ouvert ? "Fermer l'inventaire" : "Ouvrir l'inventaire",
  );
});
observateurInventaire.observe(inventaire, { attributes: true, attributeFilter: ['class'] });

// Le bouton ouvre (seulement les cases, jusqu'au prochain clic ailleurs) ou referme l'inventaire
boutonInventaire.addEventListener('click', () => {
  clearTimeout(fermetureInventaire);
  clearInterval(ecriture);
  if (inventaire.classList.contains('ouvert') && !inventaire.classList.contains('sans-cases')) {
    fermerInventaire();
    return;
  }
  cases.forEach((c) => c.classList.remove('nouvelle'));
  inventaire.classList.remove('sans-cases');
  inventaire.classList.add('ouvert', 'manuel', 'sans-message');
});

document.addEventListener('click', (e) => {
  if (!inventaire.classList.contains('manuel') && !fermetureEnAttente) return;
  if (e.target.closest('.inventaire')) return;
  fermerInventaire();
});

// Écran tactile : pas de survol, un toucher sur un objet ouvre ou ferme sa fiche
if (ecranTactile) {
  cases.forEach((caseObjet) =>
    caseObjet.addEventListener('click', () => {
      if (!caseObjet.querySelector('.fiche')) return;
      const montre = !caseObjet.classList.contains('montre');
      cases.forEach((c) => c.classList.toggle('montre', c === caseObjet && montre));
      if (!montre && fermetureEnAttente) fermerInventaire();
    }),
  );
}

// Encart affiché au survol d'un objet de l'inventaire
function creerFiche(zone) {
  const objet = zone.objet || {};
  const fiche = document.createElement('div');
  fiche.className = 'fiche';

  const nom = document.createElement('p');
  nom.className = 'fiche-nom';
  nom.textContent = objet.nom || zone.titre;

  const texte = document.createElement('p');
  texte.className = 'fiche-texte';
  const description = objet.description || zone.preuve || zone.description;
  description.split(/\[(.*?)\]/).forEach((morceau, i) => {
    if (i % 2 === 0) {
      texte.append(morceau);
    } else {
      const mot = document.createElement('span');
      mot.textContent = morceau;
      texte.append(mot);
    }
  });

  fiche.append(nom, texte);
  return fiche;
}

function ajouterPreuve(zone) {
  if (preuvesRecuperees.has(zone)) return false;
  const caseLibre = [...cases].find((c) => !c.firstElementChild);
  if (!caseLibre) return false;
  preuvesRecuperees.add(zone);
  inventaire.classList.remove('vide');

  let item;
  if (zone.image) {
    item = document.createElement('img');
    item.src = zone.image;
    item.alt = zone.titre;
  } else {
    item = document.createElement('span');
    item.textContent = zone.titre;
  }
  // Animation jouée une seule fois : sinon elle se relance à chaque réaffichage des cases
  item.classList.add('apparait');
  item.addEventListener('animationend', () => item.classList.remove('apparait'), { once: true });
  caseLibre.append(item, creerFiche(zone));
  cases.forEach((c) => c.classList.toggle('nouvelle', c === caseLibre));
  return true;
}

// ---------- Musique ----------

const musique = document.querySelector('.musique');
musique.volume = 0.8;

const ambiance = document.querySelector('.ambiance');
ambiance.volume = 0.4;

function lancerAmbiance() {
  ambiance
    .play()
    .then(() =>
      ['pointerdown', 'keydown'].forEach((type) =>
        document.removeEventListener(type, lancerAmbiance),
      ),
    )
    .catch(() => {});
}

lancerAmbiance();
['pointerdown', 'keydown'].forEach((type) => document.addEventListener(type, lancerAmbiance));

function changerMusique(source) {
  const url = new URL(source, location.href).href;
  if (musique.src === url && !musique.paused) return;
  if (musique.src !== url) musique.src = url;
  musique.play().catch(() => {});
}

// ---------- Zones ----------

function afficherZone(zone) {
  zonesVues.add(zone);
  if (zone.musique) changerMusique(zone.musique);

  const recuperable = Boolean(zone.preuve);
  if (recuperable && ajouterPreuve(zone)) {
    ouvrirInventaire(zone.preuve, true);
    inventaire.classList.add('recuperation');
    zone.elementRecupere?.classList.remove('cache');
    zone.elementDecor?.classList.add('cache');
  } else {
    ouvrirInventaire(zone.description, false);
  }
  majObjectifs();
}

function placer(element, { left, top, width, height }) {
  Object.assign(element.style, {
    left: left + '%',
    top: top + '%',
    width: width + '%',
    height: height + '%',
  });
}

// Image posée par-dessus le décor (au-dessus de la vidéo)
function superposer(source, position) {
  const image = document.createElement('img');
  image.className = 'decor-superpose';
  image.src = source;
  image.alt = '';
  image.draggable = false;
  placer(image, position);
  decor.append(image);
  return image;
}

ZONES.forEach((zone) => {
  if (zone.imageDecor) zone.elementDecor = superposer(zone.imageDecor, zone.positionDecor);
  if (zone.imageDeverrouillee) {
    zone.elementDeverrouille = superposer(zone.imageDeverrouillee, zone.positionDeverrouillee);
    zone.elementDeverrouille.classList.add('cache');
  }
  if (zone.imageRecuperee) {
    zone.elementRecupere = superposer(zone.imageRecuperee, zone.positionRecuperee);
    zone.elementRecupere.classList.add('cache');
  }

  const bouton = document.createElement('button');
  bouton.className = 'zone';
  bouton.setAttribute('aria-label', zone.titre);
  placer(bouton, zone.position);
  if (zone.extension) {
    const extension = document.createElement('span');
    extension.className = 'zone-extension';
    placer(extension, zone.extension);
    bouton.append(extension);
  }
  bouton.addEventListener('click', () => {
    bouton.classList.add('vue');
    if (zone.digicode && !zone.deverrouille) ouvrirDigicode(zone);
    else if (zone.imageZoom && !preuvesRecuperees.has(zone)) ouvrirZoom(zone, bouton);
    else afficherZone(zone);
  });
  decor.append(bouton);
});

// ---------- Parallaxe ----------

let cibleX = 0,
  cibleY = 0,
  actuelX = 0,
  actuelY = 0;

// Le décor reste figé pendant la pause, et sur écran tactile (pas de souris à suivre)
document.addEventListener('mousemove', (e) => {
  if (ecranTactile || pause.classList.contains('ouvert')) return;
  cibleX = -(e.clientX / window.innerWidth - 0.5) * 2;
  cibleY = -(e.clientY / window.innerHeight - 0.5) * 2;
});

function animerDecor() {
  actuelX += (cibleX - actuelX) * 0.05;
  actuelY += (cibleY - actuelY) * 0.05;
  scene.style.setProperty('--mx', actuelX.toFixed(4));
  scene.style.setProperty('--my', actuelY.toFixed(4));
  requestAnimationFrame(animerDecor);
}
animerDecor();
