// Désactive la navigation au clavier avec Tab : aucun élément ne doit être sélectionné
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') e.preventDefault();
});
