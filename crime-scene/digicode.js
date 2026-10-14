const digicode = document.querySelector('.digicode');
const digicodeEcran = digicode.querySelector('.digicode-ecran');
const digicodeTouches = digicode.querySelector('.digicode-touches');
const digicodeIndice = digicode.querySelector('.digicode-indice');
const DOSSIER_DIGICODE = '../assets/images/digicode/';
const DUREE_APPUI = 120;
const DUREE_RESULTAT = 900;
let zoneDigicode = null;
let saisie = '';
let bloque = false;

// ---------- Touches ----------

const touches = {};
[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].forEach((chiffre) => {
  const touche = document.createElement('button');
  touche.type = 'button';
  touche.className = 'digicode-touche';
  touche.setAttribute('aria-label', String(chiffre));

  const normale = document.createElement('img');
  normale.src = DOSSIER_DIGICODE + 'button-' + chiffre + '.png';
  normale.alt = '';
  normale.draggable = false;
  const appuyee = document.createElement('img');
  appuyee.src = DOSSIER_DIGICODE + 'button-' + chiffre + '-pressed.png';
  appuyee.alt = '';
  appuyee.draggable = false;
  appuyee.className = 'digicode-touche-appuyee';

  touche.append(normale, appuyee);
  touche.addEventListener('pointerdown', () => touche.classList.add('appuye'));
  touche.addEventListener('pointerup', () => touche.classList.remove('appuye'));
  touche.addEventListener('pointerleave', () => touche.classList.remove('appuye'));
  touche.addEventListener('click', () => taper(String(chiffre)));

  touches[chiffre] = touche;
  digicodeTouches.append(touche);
});

// ---------- Saisie ----------

function afficherSaisie() {
  const longueur = zoneDigicode.digicode.length;
  digicodeEcran.textContent = saisie.padEnd(longueur, '_').split('').join(' ');
  digicodeEcran.classList.remove('erreur', 'valide');
}

function afficherResultat(texte, classe) {
  digicodeEcran.textContent = texte;
  digicodeEcran.classList.add(classe);
}

function taper(chiffre) {
  if (bloque) return;
  saisie += chiffre;
  afficherSaisie();
  if (saisie.length < zoneDigicode.digicode.length) return;

  bloque = true;
  if (saisie === zoneDigicode.digicode) {
    afficherResultat('OUVERT', 'valide');
    setTimeout(() => {
      const zone = zoneDigicode;
      zone.deverrouille = true;
      fermerDigicode();
      afficherZone(zone);
    }, DUREE_RESULTAT);
  } else {
    afficherResultat('ERREUR', 'erreur');
    setTimeout(() => {
      saisie = '';
      bloque = false;
      afficherSaisie();
    }, DUREE_RESULTAT);
  }
}

function effacer() {
  if (bloque || !saisie) return;
  saisie = saisie.slice(0, -1);
  afficherSaisie();
}

// ---------- Ouverture / fermeture ----------

function ouvrirDigicode(zone) {
  zoneDigicode = zone;
  saisie = '';
  bloque = false;
  afficherSaisie();

  const indice = ZONES.find((z) => z.titre === zone.indiceDigicode);
  const indiceRecupere = indice && preuvesRecuperees.has(indice);
  digicodeIndice.hidden = !indiceRecupere;
  if (indiceRecupere) {
    digicodeIndice.src = indice.image;
    digicodeIndice.alt = indice.objet ? indice.objet.nom : indice.titre;
  }

  digicode.classList.add('ouvert');
}

function fermerDigicode() {
  digicode.classList.remove('ouvert');
  zoneDigicode = null;
}

// Clic à côté du boîtier pour quitter
digicode.addEventListener('click', (e) => {
  if (!bloque && e.target === digicode) fermerDigicode();
});

document.addEventListener('keydown', (e) => {
  if (!zoneDigicode) return;
  if (e.key === 'Escape' && !bloque) {
    fermerDigicode();
  } else if (e.key === 'Backspace') {
    effacer();
  } else if (/^[0-9]$/.test(e.key) && !e.repeat) {
    const touche = touches[e.key];
    touche.classList.add('appuye');
    setTimeout(() => touche.classList.remove('appuye'), DUREE_APPUI);
    taper(e.key);
  }
});
