const scene = document.querySelector('.scene');
const dialogue = document.querySelector('.dialogue');
const portrait = dialogue.querySelector('.portrait-image');
const nom = dialogue.querySelector('.dialogue-nom');
const boite = dialogue.querySelector('.dialogue-boite');
const texte = dialogue.querySelector('.dialogue-texte');
const zoneChoix = dialogue.querySelector('.dialogue-choix');
const fin = document.querySelector('.fin');
const DELAI_LETTRE = 30;

let repliques = DIALOGUE;
let index = 0;
let ecriture = null;
let finirEcriture = null;
let apresDialogue = afficherChoix;

// ---------- Répliques ----------

// Le texte restant est déjà placé (invisible) pour que les lignes ne bougent pas pendant l'écriture
function ecrire(message) {
  const ecrit = document.createElement('span');
  const reste = document.createElement('span');
  reste.className = 'dialogue-texte-reste';
  reste.textContent = message;
  texte.replaceChildren(ecrit, reste);
  dialogue.classList.add('ecriture');

  const lettres = [...message];
  let i = 0;
  finirEcriture = () => {
    clearInterval(ecriture);
    ecriture = null;
    ecrit.textContent = message;
    reste.textContent = '';
    dialogue.classList.remove('ecriture');
  };
  ecriture = setInterval(() => {
    i++;
    ecrit.textContent = lettres.slice(0, i).join('');
    reste.textContent = lettres.slice(i).join('');
    if (i >= lettres.length) finirEcriture();
  }, DELAI_LETTRE);
}

function afficherReplique() {
  const replique = repliques[index];
  nom.textContent = replique.nom;
  portrait.src = PORTRAITS[replique.portrait];
  ecrire(replique.texte);
}

// Un clic termine la phrase en cours, sinon passe à la suivante
function avancer() {
  if (dialogue.classList.contains('choix') || fin.classList.contains('ouvert')) return;
  if (ecriture) return finirEcriture();
  index++;
  if (index < repliques.length) afficherReplique();
  else apresDialogue();
}

boite.addEventListener('click', avancer);
document.addEventListener('keydown', (e) => {
  if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
    e.preventDefault();
    avancer();
  }
});

// ---------- Choix ----------

function afficherChoix() {
  dialogue.classList.add('choix');
  zoneChoix.replaceChildren(
    ...CHOIX.map((choix) => {
      const bouton = document.createElement('button');
      bouton.type = 'button';
      bouton.className = 'bouton-coin';
      bouton.textContent = choix.bouton;
      bouton.addEventListener('click', () => choisir(choix));
      return bouton;
    }),
  );
}

function choisir(choix) {
  dialogue.classList.remove('choix');
  repliques = choix.suite;
  index = 0;
  apresDialogue = () => afficherFin(choix.fin);
  afficherReplique();
}

// ---------- Fin ----------

function afficherFin({ titre, texte: message }) {
  fin.querySelector('.fin-titre').textContent = titre;
  fin.querySelector('.fin-texte').textContent = message;
  fin.classList.add('ouvert');
}

fin.querySelector('.fin-menu').addEventListener('click', () => {
  // Ouverte depuis le menu : on referme simplement le cadre du jeu pour garder le plein écran
  if (pageRacine !== window) pageRacine.fermerJeu();
  else location.href = '../main-menu/index.html';
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

afficherReplique();
