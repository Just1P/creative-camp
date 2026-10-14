# Blade Runner 2099

Jeu d'enquête dans le navigateur, inspiré de l'univers Blade Runner. Inspectez la scène de crime, récupérez les indices et percez le code du coffre.

Le jeu est fait en HTML, CSS et JavaScript, sans framework ni étape de build.

## Télécharger le jeu

**Avec Git :**

```bash
git clone https://github.com/Just1P/creative-camp.git
cd creative-camp
```

**Sans Git :** sur la [page GitHub du projet](https://github.com/Just1P/creative-camp), cliquez sur **Code** puis **Download ZIP**, et décompressez l'archive.

> Le dépôt contient des vidéos assez lourdes (environ 150 Mo au total), le téléchargement peut prendre un moment.

## Lancer le jeu

### En un double-clic (recommandé)

- **Mac** : double-cliquez sur `Lancer le jeu (Mac).command`
- **Windows** : double-cliquez sur `Lancer le jeu (Windows).bat`

Le jeu s'ouvre tout seul dans votre navigateur. Gardez la fenêtre du terminal ouverte pendant que vous jouez, et fermez-la pour arrêter le jeu.

> Il faut [Python 3](https://www.python.org/downloads/) (déjà présent sur Mac). Sur Windows, si Python n'est pas installé, le jeu s'ouvre quand même, mais sans pouvoir avancer dans les vidéos.
>
> Sur Mac, si un message dit que le fichier ne peut pas être ouvert : clic droit sur le fichier, puis **Ouvrir**, puis **Ouvrir** à nouveau.

### Autres façons de lancer le jeu

Pour les développeurs, ou si le double-clic ne fonctionne pas.

#### Option 1 : VS Code + Live Server

1. Ouvrez le dossier du projet dans [VS Code](https://code.visualstudio.com/).
2. Installez l'extension **Live Server** (Ritwick Dey).
3. Faites un clic droit sur `index.html` à la racine, puis **Open with Live Server**.

Le jeu s'ouvre dans le navigateur (port 5501 par défaut).

#### Option 2 : Node.js

```bash
npx serve .
```

Puis ouvrez l'adresse affichée dans le terminal (en général <http://localhost:3000>).

#### Option 3 : sans serveur

Double-cliquez sur `index.html`. Le jeu fonctionne en général, mais certains navigateurs peuvent bloquer des médias en ouvrant les fichiers directement. En cas de souci, utilisez une des options ci-dessus.

## Comment jouer

- Depuis le menu principal, cliquez sur **Jouer**.
- Cliquez sur la scène (ou appuyez sur une touche) pour lancer l'ambiance sonore. Pensez à activer le son.
- Survolez et cliquez sur les zones de la scène pour les inspecter et récupérer des indices dans votre inventaire.
- Suivez votre progression dans les objectifs, en haut de l'écran.
- Au digicode, tapez le code à la souris ou au clavier (`0`–`9`), `Retour arrière` pour effacer, `Échap` pour fermer.

Navigateur conseillé : une version récente de Chrome, Firefox, Edge ou Safari, sur ordinateur.

## Structure du projet

```
index.html        Point d'entrée, redirige vers le menu
serveur.py        Serveur local utilisé par les fichiers « Lancer le jeu »
main-menu/        Menu principal et trailer
crime-scene/      Scène de crime, inventaire, digicode
shared/           Styles communs
assets/           Images, vidéos, musiques et polices
```
