// Portraits des personnages
const PORTRAITS = {
  maya: '../assets/images/maya-icon.png',
  mayaEssoufflee: '../assets/images/maya-icon-tired.png',
  angela: '../assets/images/angela-icon-pose.png',
};

const DIALOGUE = [
  { nom: 'Maya', portrait: 'mayaEssoufflee', texte: 'Bouge plus… Angela. C’est fini.' },
  { nom: 'Angela', portrait: 'angela', texte: 'Reprends ton souffle, Blade Runner. Je ne vais nulle part.' },
  {
    nom: 'Maya',
    portrait: 'mayaEssoufflee',
    texte: 'Le conseiller Varn… Tes empreintes sont partout sur l’arme.',
  },
  {
    nom: 'Angela',
    portrait: 'angela',
    texte:
      'Je ne le nie pas. Mais tu as ouvert son coffre. Des humains arrêtés sans procès, signés de sa main.',
  },
  {
    nom: 'Angela',
    portrait: 'angela',
    texte: 'Ma sœur était sur cette liste. À côté de son nom, un seul mot : « Traitée ».',
  },
  {
    nom: 'Maya',
    portrait: 'maya',
    texte: 'Et tu crois qu’en tuant des réplicants un par un, tu vas changer quelque chose ?',
  },
  {
    nom: 'Angela',
    portrait: 'angela',
    texte: 'Je ne fais pas la guerre aux réplicants. Je la fais à ceux qui signent ces ordres.',
  },
  {
    nom: 'Angela',
    portrait: 'angela',
    texte: 'Ramène-moi, et ils effaceront tout. Ou aide-moi à atteindre ceux qui sont au sommet.',
  },
];

const CHOIX = [
  {
    bouton: 'Rejoindre Angela',
    suite: [
      { nom: 'Maya', portrait: 'maya', texte: 'Montre-moi la liste.' },
      { nom: 'Angela', portrait: 'angela', texte: 'Bienvenue de l’autre côté, Maya.' },
    ],
    fin: {
      titre: 'Alliance',
      texte: 'Vous avez rejoint le combat d’Angela.',
    },
  },
  {
    bouton: 'Combattre Angela',
    suite: [
      {
        nom: 'Maya',
        portrait: 'maya',
        texte: 'Je suis désolée, Angela. Je ne peux pas te laisser faire.',
      },
      { nom: 'Angela', portrait: 'angela', texte: 'Dommage. J’espérais que tu serais différente.' },
    ],
    fin: {
      titre: 'Affrontement',
      texte: 'Vous avez choisi de vous battre contre Angela.',
    },
  },
];
