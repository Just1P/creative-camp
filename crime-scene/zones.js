const ZONES = [
  {
    titre: 'Corp',
    description: 'Blessures et trace de tissu du manteau d’angela',
    position: { left: 42, top: 73, width: 32, height: 16 },
  },
  {
    titre: 'Fenêtre',
    description: 'Ça fait maintenant 34 jours qu’il pleut...',
    position: { left: 18.25, top: 8.5, width: 33, height: 55 },
  },
  {
    titre: 'Arme',
    description: 'Arme du meurtre avec aucune empreinte de la victime',
    preuve: 'Ce pistolet semble être l’arme du crime',
    image: '../assets/images/arme.png',
    objet: {
      nom: 'Pistolet 9mm',
      description:
        'Ce [pistolet] serait [l’arme du crime], la [balle] retrouvée sur le corps de la victime confirme cette hypothèse',
      type: 'Indice',
    },
    position: { left: 60, top: 93, width: 8, height: 5 },
  },
  {
    titre: 'Malette',
    description: 'Une malette posée à côté du corps.',
    preuve: 'La malette contient des documents sur des disparitions d’humains',
    image: '../assets/images/documents-infos.png',
    objet: {
      nom: 'Documents',
      description:
        'Des [dossiers] recensant des [disparitions d’humains], soigneusement rangés dans la malette de la victime',
      type: 'Indice',
    },
    position: { left: 40, top: 81, width: 9.5, height: 12 },
  },
  {
    titre: 'Porte menteau',
    description: 'Ca sert à porter des manteaux en gros',
    position: { left: 94, top: 33, width: 6, height: 45 },
  },
  {
    titre: 'Coffre',
    description:
      'Dossiers confidentiels d’arrestations d’humains autorisés et signés par des repliquants haut placés',
    preuve: 'Le coffre contient des dossiers d’arrestations signés par des réplicants haut placés',
    image: '../assets/images/documents-arrest.png',
    objet: {
      nom: 'Dossiers d’arrestation',
      description:
        'Des [dossiers confidentiels] d’[arrestations d’humains], autorisés et signés par des [réplicants haut placés]',
      type: 'Indice',
    },
    digicode: '9732',
    // Zone dont l'indice affiche le code à côté du digicode une fois récupéré
    indiceDigicode: 'Bonsaï',
    position: { left: 80, top: 52, width: 11, height: 35 },
  },
  {
    titre: 'Emission de propagande',
    description: 'Présente Angela comme une terroriste , média manipulé par le gouvernement',
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
      'Enregistrement partiel de l’effraction, mais le meurtre et la lutte ont été effacés.',
    position: { left: 65, top: 13, width: 4, height: 8 },
  },
  {
    titre: 'Trace de sang',
    description: 'Traces de sang appartenant à Angela.',
    position: { left: 62, top: 22, width: 10, height: 28 },
  },
  {
    titre: 'Photos',
    description: 'Visages d’humains disparus dont la soeur d’Angela.',
    preuve: 'Parmi les photos de disparus, on reconnaît la soeur d’Angela',
    image: '../assets/images/photo.png',
    objet: {
      nom: 'Photos',
      description:
        'Des [photos] de [visages d’humains disparus], parmi lesquels on reconnaît la [soeur d’Angela]',
      type: 'Indice',
    },
    position: { left: 66, top: 52, width: 7, height: 15 },
    extension: { left: -57, top: 13, width: 57, height: 43 },
  },
  {
    titre: 'Messagerie',
    description: 'Menaces recues en anonyme mais on peut reconnaire Angela.',
    position: { left: 60, top: 61, width: 5, height: 5 },
  },
  {
    titre: 'Aquarium',
    description: 'Quelle idée de mettre ses poissons dans une TV...',
    position: { left: 50, top: 52, width: 9, height: 15 },
  },
  {
    titre: 'Terminal',
    description: 'Un vieux terminal, l’écran est encore allumé.',
    position: { left: 31, top: 61, width: 5, height: 30 },
  },
  {
    titre: 'Vinyle',
    description: 'Même en 2099, Wish You Were Here reste un classique.',
    position: { left: 22.5, top: 70, width: 8.5, height: 12 },
  },
  {
    titre: 'Lampe',
    description: 'Une lampe à lave qui diffuse une lueur violette.',
    position: { left: 13.75, top: 63.5, width: 6, height: 28 },
  },
  {
    titre: 'Bonsaï',
    description: 'Code du coffre-fort caché à l’intérieur.',
    preuve: 'Un papier caché dans le bonsaï contient le code du coffre-fort',
    image: '../assets/images/code.png',
    objet: {
      nom: 'Code du coffre',
      description:
        'Un [bout de papier] dissimulé dans la terre du [bonsaï], sur lequel est griffonné le [code du coffre-fort]',
      type: 'Indice',
    },
    position: { left: 17, top: 45.5, width: 10.5, height: 18 },
  },
  {
    titre: 'Juke-box',
    description: 'Un vieux juke-box, il ne marche plus depuis longtemps.',
    position: { left: 6, top: 38.5, width: 7.5, height: 57 },
  },
  {
    titre: 'Enseigne',
    description: 'Empathy Tester, l’enseigne est éteinte.',
    position: { left: 9.75, top: 0, width: 12, height: 13.5 },
  },
  {
    titre: 'Échiquier',
    description: 'Une partie d’échecs laissée en plan.',
    position: { left: 69, top: 66.75, width: 13, height: 6.25 },
  },
];
