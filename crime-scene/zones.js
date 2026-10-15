const ZONES = [
  {
    titre: 'Corps',
    description:
      'Conseiller Varn, réplicant haut placé du gouvernement. Abattu chez lui. Encore une victime d’Angela.',
    position: { left: 42, top: 73, width: 32, height: 16 },
  },
  {
    titre: 'Fenêtre',
    description:
      'Ça fait 672 jours qu’il pleut sur la ville. Quelque part dehors, Angela court toujours.',
    position: { left: 18.25, top: 8.5, width: 33, height: 55 },
  },
  {
    titre: 'Arme',
    description: 'L’arme du crime. Les empreintes d’Angela sont partout sur la crosse.',
    preuve: 'Ce pistolet porte les empreintes d’Angela : c’est l’arme du crime',
    image: '../assets/images/arme.png',
    imageRecuperee: '../assets/images/sol-sans-arme.png',
    positionRecuperee: { left: 54.38, top: 88.1, width: 16.41, height: 12.22 },
    objet: {
      nom: 'Pistolet 9mm',
      description:
        'Le [pistolet] porte les [empreintes d’Angela], et la [balle] retrouvée dans le corps de la victime en provient. L’affaire semble entendue',
      type: 'Indice',
    },
    position: { left: 60, top: 93, width: 8, height: 5 },
  },
  {
    titre: 'Mallette',
    description: 'La mallette de la victime. Ces dossiers n’ont rien à faire chez un conseiller.',
    preuve: 'La mallette de la victime contient des dossiers sur des disparitions d’humains',
    image: '../assets/images/documents-infos.png',
    imageRecuperee: '../assets/images/malette-open.png',
    positionRecuperee: { left: 39.24, top: 74.77, width: 11.17, height: 18.52 },
    objet: {
      nom: 'Documents',
      description:
        'Des [dossiers] recensant des [disparitions d’humains], classés et annotés de la main de la [victime]. Pourquoi les gardait-il ?',
      type: 'Indice',
    },
    position: { left: 40, top: 81, width: 9.5, height: 12 },
  },
  {
    titre: 'Porte menteau',
    description: 'Ca sert à porter des manteaux il me semble',
    position: { left: 94, top: 33, width: 6, height: 45 },
  },
  {
    titre: 'Coffre',
    description:
      'Des ordres d’arrestation d’humains, signés par la victime et d’autres réplicants haut placés. Aucun n’est passé par la justice.',
    preuve:
      'Le coffre contient des ordres d’arrestation d’humains signés par des réplicants haut placés',
    image: '../assets/images/documents-arrest.png',
    objet: {
      nom: 'Ordres d’arrestation',
      description:
        'Des [ordres confidentiels] d’[arrestations d’humains], signés par la victime et d’[autres réplicants haut placés]. Aucun procès, aucune trace officielle',
      type: 'Indice',
    },
    digicode: '9732',

    indiceDigicode: 'Bonsaï',
    imageDeverrouillee: '../assets/images/coffr-open.png',
    positionDeverrouillee: { left: 79.4, top: 52.3, width: 13, height: 39.1 },
    position: { left: 80, top: 52, width: 11, height: 35 },
  },
  {
    titre: 'Émission de propagande',
    description:
      '« Angela, terroriste humaine, ennemie de l’ordre. » Les infos tournent en boucle, toujours le même message.',
    position: { left: 83, top: 35, width: 9, height: 16 },
  },
  {
    titre: 'Lampadaire',
    description: 'C’est vraiment juste un lampadaire.',
    position: { left: 74, top: 2, width: 11, height: 16 },
  },
  {
    titre: 'Caméra',
    description:
      'L’enregistrement a été effacé, mais pas par Angela : l’accès vient d’un code du gouvernement.',
    position: { left: 65, top: 13, width: 4, height: 8 },
  },
  {
    titre: 'Trace de sang',
    description: 'Du sang d’Angela. Elle était bien là, et elle est blessée.',
    position: { left: 62, top: 22, width: 10, height: 28 },
  },
  {
    titre: 'Photos',
    description:
      'Des visages d’humains disparus. Parmi eux, la sœur d’Angela. Ce n’était peut-être pas qu’un meurtre.',
    preuve: 'Parmi les photos des disparus, on reconnaît la sœur d’Angela',
    image: '../assets/images/photo.png',
    objet: {
      nom: 'Photos',
      description:
        'Des [photos] de [visages d’humains disparus], épinglées chez la victime. Parmi eux, la [sœur d’Angela]',
      type: 'Indice',
    },
    position: { left: 66, top: 52, width: 7, height: 15 },
    extension: { left: -57, top: 13, width: 57, height: 43 },
  },
  {
    titre: 'Téléphone',
    description:
      'Un téléphone aussi vieux en 2099 ? Pratique pour passer des appels qu’on ne trace pas.',
    position: { left: 60, top: 61, width: 5, height: 5 },
  },
  {
    titre: 'Aquarium',
    description: 'Quelle idée de mettre ses poissons dans une TV...',
    position: { left: 50, top: 52, width: 9, height: 15 },
  },
  {
    titre: 'Terminal',
    description:
      'Le terminal de la victime, encore allumé. Une liste de noms d’humains, avec une mention : « Traité ».',
    position: { left: 31, top: 61, width: 5, height: 30 },
  },
  {
    titre: 'Vinyle',
    description: 'Ce son me dit quelque chose.',
    musique: '../assets/musiques/One More Kiss, Dear - Vangelis.mp3',
    position: { left: 22.5, top: 70, width: 8.5, height: 12 },
  },
  {
    titre: 'Lampe',
    description: 'Une lampe à lave qui diffuse une lueur violette.',
    position: { left: 13.75, top: 63.5, width: 6, height: 28 },
  },
  {
    titre: 'Bonsaï',
    description: 'Le code du coffre-fort était caché dans les branches. Qu’avait-il à cacher ?',
    preuve: 'Un papier caché dans le bonsaï contient le code du coffre-fort',
    image: '../assets/images/code.png',
    objet: {
      nom: 'Code du coffre',
      description:
        'Un [bout de papier] dissimulé dans la terre du [bonsaï], sur lequel est griffonné le [code du coffre-fort]',
      type: 'Indice',
    },
    imageDecor: '../assets/images/bonzai.png',
    imageZoom: '../assets/images/bonzai-zoom.png',
    imageZoomRecuperee: '../assets/images/bonzai-no-paper.png',
    positionDecor: { left: 16.95, top: 45.4, width: 10.95, height: 19.47 },
    position: { left: 17, top: 45.5, width: 10.5, height: 18 },
  },
  {
    titre: 'Juke-box',
    description: 'Un vieux juke-box, il ne marche plus depuis longtemps.',
    position: { left: 6, top: 38.5, width: 7.5, height: 57 },
  },
  {
    titre: 'Échiquier',
    description: 'Une partie d’échecs laissée en plan.',
    position: { left: 69, top: 66.75, width: 13, height: 6.25 },
  },
];
