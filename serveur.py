"""Petit serveur local pour lancer le jeu.

Contrairement à `python3 -m http.server`, il gère les requêtes Range,
ce qui permet d'avancer et reculer dans les vidéos.
"""

import http.server
import os
import re
import socketserver
import webbrowser

PORT = 8000
DOSSIER = os.path.dirname(os.path.abspath(__file__))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DOSSIER, **kwargs)

    def send_head(self):
        plage = self.headers.get("Range")
        chemin = self.translate_path(self.path)
        match = re.match(r"bytes=(\d*)-(\d*)$", plage or "")
        if not match or not os.path.isfile(chemin):
            return super().send_head()

        taille = os.path.getsize(chemin)
        debut, fin = match.groups()
        if debut:
            debut, fin = int(debut), int(fin) if fin else taille - 1
        else:
            debut, fin = taille - int(fin), taille - 1
        fin = min(fin, taille - 1)
        if debut > fin or debut < 0:
            self.send_error(416)
            return None

        fichier = open(chemin, "rb")
        fichier.seek(debut)
        self.longueur = fin - debut + 1
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(chemin))
        self.send_header("Content-Range", f"bytes {debut}-{fin}/{taille}")
        self.send_header("Content-Length", str(self.longueur))
        self.send_header("Accept-Ranges", "bytes")
        self.end_headers()
        return fichier

    def copyfile(self, source, destination):
        longueur = getattr(self, "longueur", None)
        if longueur is None:
            return super().copyfile(source, destination)
        self.longueur = None
        while longueur > 0:
            bloc = source.read(min(64 * 1024, longueur))
            if not bloc:
                break
            destination.write(bloc)
            longueur -= len(bloc)

    def log_message(self, *args):
        pass


class Serveur(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


if __name__ == "__main__":
    with Serveur(("127.0.0.1", PORT), Handler) as serveur:
        url = f"http://localhost:{PORT}"
        print(f"Blade Runner 2099 tourne sur {url}")
        print("Fermez cette fenêtre (ou Ctrl+C) pour arrêter le jeu.")
        webbrowser.open(url)
        try:
            serveur.serve_forever()
        except KeyboardInterrupt:
            pass
