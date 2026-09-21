# Projet Démo Copilot dans IntelliJ IDEA : Modernisation Angular & SNCF WCS

Ce dépôt sert de support pour une démonstration en direct (live demo) de l'utilisation de **GitHub Copilot** dans **IntelliJ IDEA**.

## 📖 Guide de la démonstration

👉 **Consultez le guide complet pas à pas : [DEMO_GUIDE.md](DEMO_GUIDE.md)**

Ce guide contient :
- Les prompts exacts à copier/coller ou à taper
- Le discours explicatif (ce qu'il faut dire à voix haute)
- Les raccourcis clavier clés dans IntelliJ
- Le déroulé chronologique minuté
- Les astuces pour éviter les aléas du direct

## 🔄 Réinitialiser la démo entre deux répétitions

Pour remettre le projet à son état de départ en 1 seconde :

**Sous PowerShell :**
```powershell
.\scripts\reset-demo.ps1
```

**Ou via Git :**
```bash
git reset --hard initial-demo-state
git clean -fd
```
