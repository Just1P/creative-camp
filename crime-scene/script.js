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
}

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
}

// Fermeture automatique repoussée tant que la souris est sur les cases
function fermerInventaireAuto() {
  if (!inventaire.classList.contains('sans-cases') && zoneCases.matches(':hover')) {
    fermetureEnAttente = true;
    return;
  }
  fermerInventaire();
}

zoneCases.addEventListener('mouseleave', () => {
  if (fermetureEnAttente) fermerInventaire();
});

const observateurInventaire = new MutationObserver(() => {
  const ouvert = inventaire.classList.contains('ouvert') && !inventaire.classList.contains('sans-cases');
  boutonInventaire.setAttribute('aria-label', ouvert ? "Fermer l'inventaire" : "Ouvrir l'inventaire");
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
  if (!inventaire.classList.contains('manuel')) return;
  if (e.target.closest('.inventaire')) return;
  fermerInventaire();
});

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

  const type = document.createElement('p');
  type.className = 'fiche-type';
  type.textContent = objet.type || 'Indice';

  fiche.append(nom, texte, type);
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
  caseLibre.append(item, creerFiche(zone));
  cases.forEach((c) => c.classList.toggle('nouvelle', c === caseLibre));
  return true;
}

// ---------- Zones ----------

function afficherZone(zone) {
  zonesVues.add(zone);

  const recuperable = Boolean(zone.preuve);
  if (recuperable && ajouterPreuve(zone)) {
    ouvrirInventaire(zone.preuve, true);
    inventaire.classList.add('recuperation');
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

ZONES.forEach((zone) => {
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
    if (zone.digicode && !zone.deverrouille) ouvrirDigicode(zone);
    else afficherZone(zone);
  });
  decor.append(bouton);
});

// ---------- Parallaxe ----------

let cibleX = 0,
  cibleY = 0,
  actuelX = 0,
  actuelY = 0;

document.addEventListener('mousemove', (e) => {
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
