# Réinitialise le projet à son état initial pour rejouer la démo
git checkout master
git reset --hard 2633951
git clean -fd -e DEMO_GUIDE.md -e scripts/
Write-Host "Le projet a été réinitialisé à l'état initial pour la démo." -ForegroundColor Green
