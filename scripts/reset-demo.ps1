# Réinitialise le projet à son état initial pour rejouer la démo
git checkout master
git reset --hard initial-demo-state
git clean -fd
Write-Host "Le projet a été réinitialisé au tag initial-demo-state pour rejouer la démo !" -ForegroundColor Green
