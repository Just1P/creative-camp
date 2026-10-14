@echo off
cd /d "%~dp0"
where py >nul 2>nul && (py serveur.py & goto :eof)
where python >nul 2>nul && (python serveur.py & goto :eof)
echo Python n'est pas installe : ouverture du jeu sans serveur.
start "" "index.html"
