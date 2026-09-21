# Guide Pas-à-Pas : Démonstration GitHub Copilot dans IntelliJ IDEA
## Cas d'usage : Modernisation d'une application Angular SNCF avec Web Components (WCS)

---

## 🎯 Fiche d'identité de la démonstration

- **Durée totale recommandée** : 20 à 25 minutes (+ 5 min de questions/réponses).
- **Public cible** : Développeurs front, Tech Leads, Architectes, Managers techniques.
- **Environnement** : IntelliJ IDEA (avec le plugin officiel *GitHub Copilot* installé et activé).
- **Projet de départ** : Application Angular (v16, `NgModule`, RxJS avec `BehaviorSubject` et fuites potentielles, Web Components SNCF `wcs-core`).
- **Objectifs de la démo** :
  1. Démontrer l'efficacité de Copilot sur des refactorings réels et non triviaux.
  2. Générer un script de mise à jour des dépendances en tenant compte de la matrice de compatibilité (Angular / TypeScript / WCS).
  3. Migrer l'architecture `NgModule` vers des **Standalone Components** en intégrant les Web Components SNCF (`CUSTOM_ELEMENTS_SCHEMA`).
  4. Remplacer la gestion d'état RxJS verbeuse (`BehaviorSubject`, `combineLatest`, `takeUntil`) par les **Angular Signals** (`signal`, `computed`).
  5. Moderniser les templates HTML avec le **Nouveau Control Flow** (`@if`, `@for`, `@empty`).
  6. Montrer les interactions clés dans IntelliJ : **Copilot Chat**, **Copilot Inline Edit** et **complétion contextuelle**.

---

## ⌨️ Raccourcis indispensables IntelliJ IDEA à avoir en tête

| Action | Raccourci Windows / Linux | Raccourci macOS |
| :--- | :--- | :--- |
| **Ouvrir le panneau Copilot Chat** | `Ctrl + Shift + I` *(ou clic sur l'icône dans la barre droite)* | `Cmd + Shift + I` |
| **Copilot Inline Edit / Prompt dans l'éditeur** | `Ctrl + \` ou `Alt + Entrée` > Copilot | `Cmd + \` ou `Option + Entrée` |
| **Accepter une suggestion inline** | `Tab` | `Tab` |
| **Suggestion suivante / précédente** | `Alt + ]` / `Alt + [` | `Option + ]` / `Option + [` |
| **Afficher le diff / appliquer la modification** | Bouton `Accept` / `Ctrl + Entrée` | `Cmd + Entrée` |

---

## ⏱️ Déroulé chronologique de la session

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 00:00 - 03:00 │ Acte 0 : Présentation du contexte et de la dette technique   │
│ 03:00 - 07:00 │ Acte 1 : Script de montée de version (package.json)          │
│ 07:00 - 13:00 │ Acte 2 : Migration vers les Standalone Components & WCS      │
│ 13:00 - 18:00 │ Acte 3 : Du RxJS verbeux aux Angular Signals modernes        │
│ 18:00 - 21:00 │ Acte 4 : Modernisation des templates (Control Flow @if/@for)  │
│ 21:00 - 24:00 │ Acte 5 : Effet "Waouh" : Génération de composant WCS & Tests  │
│ 24:00 - 25:00 │ Conclusion & Métriques de productivité                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎬 Acte 0 : Introduction & Présentation de l'existant (3 min)

### Ce que vous dites à voix haute (Speech) :
> *"Bienvenue à tous. Aujourd'hui, nous allons voir comment GitHub Copilot intégré directement dans notre IDE IntelliJ IDEA nous aide concrètement sur une tâche que nous rencontrons tous les jours : la modernisation d'une application existante.*
> 
> *Voici notre application SNCF de consultation des départs de train. Elle fonctionne, mais elle accumule de la dette technique :*
> 1. *Elle est basée sur des `NgModule` classiques (`AppModule`), alors qu'Angular recommande désormais les Standalone Components.*
> 2. *La gestion d'état repose sur du RxJS avec des `BehaviorSubject` et des souscriptions manuelles qui nécessitent du boilerplate pour éviter les fuites mémoire.*
> 3. *Elle utilise les Web Components SNCF WCS, ce qui implique des règles particulières (comme le `CUSTOM_ELEMENTS_SCHEMA`).*
> 
> *Plutôt que de faire ces refactorings fastidieux à la main, nous allons piloter Copilot pour moderniser l'application en quelques minutes."*

### Ce que vous montrez dans IntelliJ :
1. Ouvrez `src/app/app.module.ts` pour montrer l'architecture classique `NgModule` avec `CUSTOM_ELEMENTS_SCHEMA`.
2. Ouvrez `src/app/services/train.service.ts` pour montrer les `BehaviorSubject` et `combineLatest`.
3. Ouvrez `src/app/components/train-filter/train-filter.component.ts` pour montrer `destroy$` et `takeUntil`.

---

## 🚀 Acte 1 : Audit et script de montée de version des dépendances (4 min)

### Objectif :
Montrer la capacité de Copilot à analyser les dépendances dans `package.json`, détecter les incompatibilités et produire un script de mise à niveau automatisé sécurisé.

### Action dans IntelliJ :
1. Ouvrez le fichier `package.json`.
2. Ouvrez le panneau **GitHub Copilot Chat** (`Ctrl + Shift + I` ou clic sur l'icône Copilot à droite).
3. Assurez-vous que `package.json` est ouvert ou référencé dans le chat via `#file:package.json`.

### 💬 Prompt à saisir dans Copilot Chat :
```text
Voici le fichier package.json d'une application Angular qui utilise les Web Components SNCF (wcs-core).
Je souhaite faire monter ce projet vers la version stable d'Angular 17 (ou 18).

Analyse les dépendances actuelles et génère :
1. Les commandes PowerShell à exécuter dans le terminal d'IntelliJ pour effectuer la migration étape par étape ('ng update' et 'npm install').
2. La liste des points d'attention (compatibilité TypeScript, Node.js, RxJS et wcs-core).
3. Les flags recommandés (par exemple --force si nécessaire pour les peer-dependencies).
```

### Ce que vous dites à voix haute pendant la génération :
> *"Regardez comment Copilot procède. Il ne se contente pas de nous dire de changer des numéros de version au hasard. Il comprend les étapes de migration d'Angular : d'abord le core et le CLI, puis les dépendances tierces, tout en vérifiant la compatibilité de TypeScript et de RxJS.*
> 
> *Dans IntelliJ, nous pouvons copier directement les commandes du bloc de code vers le terminal intégré d'un simple clic."*

### Résultat attendu :
Copilot génère un script structuré du type :
```powershell
# Mise à jour Angular CLI & Core vers v17
npx @angular/cli@17 update @angular/core@17 @angular/cli@17 --allow-dirty

# Vérification et mise à jour de TypeScript et RxJS compatibles
npm install typescript@~5.2.0 rxjs@~7.8.0

# Conservation / mise à jour des Web Components SNCF
npm install wcs-core@latest
```

---

## 🧩 Acte 2 : Migration vers les Standalone Components & Web Components WCS (6 min)

### Objectif :
Supprimer `AppModule` et migrer `TrainListComponent`, `TrainFilterComponent` et `AppComponent` en standalone components, en important directement `WcsAngularModule` (conformément à la documentation officielle SNCF WCS).

### Étape 2.1 : Migration de TrainListComponent
1. Ouvrez `src/app/components/train-list/train-list.component.ts`.
2. Sélectionnez l'ensemble de la classe et du décorateur `@Component`.
3. Lancez **Copilot Inline Edit** (`Ctrl + \` ou clic droit > *Copilot* > *Generate Code / Edit*).

### 💬 Prompt Inline :
```text
Migre ce composant en Standalone Component Angular.
Importe CommonModule et WcsAngularModule depuis 'wcs-angular' pour le support officiel des composants SNCF.
```

### Ce que vous dites à voix haute :
> *"Selon la documentation officielle de la SNCF (wcs.dev.sncf), pour utiliser les composants WCS dans une architecture Angular Standalone, il suffit d'importer `WcsAngularModule` dans le tableau `imports` de chaque composant autonome. Voyons comment Copilot s'en charge."*

### Résultat attendu dans le diff IntelliJ :
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WcsAngularModule } from 'wcs-angular';
import { Observable } from 'rxjs';
import { Train } from '../../models/train.model';
import { TrainService } from '../../services/train.service';

@Component({
  selector: 'app-train-list',
  standalone: true,
  imports: [CommonModule, WcsAngularModule],
  templateUrl: './train-list.component.html',
  styleUrls: ['./train-list.component.css']
})
export class TrainListComponent implements OnInit { ... }
```
👉 *Cliquez sur **Accept** (ou raccourci `Ctrl + Enter`).*

---

### Étape 2.2 : Migration de TrainFilterComponent & AppComponent
1. Ouvrez `src/app/components/train-filter/train-filter.component.ts`.
2. Ouvrez le chat ou inline prompt (`Ctrl + \`) :
   ```text
   Rends ce composant standalone: true en important FormsModule, CommonModule et WcsAngularModule.
   ```
3. Ouvrez `src/app/app.component.ts` et demandez :
   ```text
   Transforme AppComponent en composant Standalone important TrainListComponent, TrainFilterComponent et CommonModule.
   ```

---

### Étape 2.3 : Modernisation du bootstrap dans `src/main.ts`
1. Ouvrez `src/main.ts`.
2. Sélectionnez le bootstrap existant.
3. Dans Copilot Inline Chat (`Ctrl + \`) :

### 💬 Prompt :
```text
Remplace le bootstrap basé sur AppModule par 'bootstrapApplication(AppComponent)' tout en conservant 'defineCustomElements()' de wcs-core/loader.
```

### Résultat attendu :
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { defineCustomElements } from 'wcs-core/loader';
import { AppComponent } from './app/app.component';

// Enregistrement des Custom Elements SNCF WCS
defineCustomElements();

bootstrapApplication(AppComponent).catch(err => console.error(err));
```

### Ce que vous dites à voix haute :
> *"Nous venons de supprimer le besoin d'avoir `app.module.ts`. Notre application est désormais 100% Standalone, suit scrupuleusement la documentation officielle SNCF WCS avec `defineCustomElements()` et `WcsAngularModule`, et respecte les bonnes pratiques actuelles d'Angular."*

---

## ⚡ Acte 3 : Du RxJS verbeux aux Angular Signals (6 min)

### Objectif :
Remplacer les `BehaviorSubject` et `combineLatest` par les nouveaux `signal()` et `computed()`. C'est le moment le plus impressionnant de la démo car il montre la compréhension algorithmique de Copilot.

### Étape 3.1 : Refactorisation de `TrainService`
1. Ouvrez `src/app/services/train.service.ts`.
2. Ouvrez le panneau Copilot Chat (`Ctrl + Shift + I`).

### 💬 Prompt dans Copilot Chat :
```text
Refactorise cette classe TrainService pour remplacer tous les BehaviorSubject et combineLatest par les Signals Angular (signal et computed).
Conserve exactement la même logique métier :
- Un signal 'trains' initialisé avec INITIAL_TRAINS
- Un signal 'searchQuery' (string)
- Un signal 'selectedType' (string)
- Un signal calculé (computed) 'filteredTrains' qui filtre les trains selon la recherche et le type
- Un signal calculé 'totalSeatsAvailable' qui calcule la somme des places restantes
- Adapte les méthodes setSearchQuery, setFilterType et bookSeat
- Pour refreshTrains, utilise un délai asynchrone pour mettre à jour le signal.
```

### Ce que vous dites à voix haute :
> *"Regardez la transformation du code. Auparavant, nous avions besoin de créer un `BehaviorSubject` privé, d'exposer un `asObservable()` public, puis d'écrire un `combineLatest` avec des opérateurs `map`.
>
> Avec les Signals, le code devient déclaratif, lisible et infiniment plus performant. Copilot génère un signal dérivé `computed()` qui traque automatiquement les dépendances `trains()`, `searchQuery()` et `selectedType()`."*

### Résultat attendu :
```typescript
@Injectable({
  providedIn: 'root'
})
export class TrainService {
  readonly trains = signal<Train[]>(INITIAL_TRAINS);
  readonly searchQuery = signal<string>('');
  readonly selectedType = signal<string>('ALL');
  readonly isLoading = signal<boolean>(false);

  readonly filteredTrains = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const type = this.selectedType();
    
    return this.trains().filter(train => {
      const matchesQuery = !q ||
        train.departureStation.toLowerCase().includes(q) ||
        train.arrivalStation.toLowerCase().includes(q) ||
        train.trainNumber.toLowerCase().includes(q);

      const matchesType = type === 'ALL' || train.type === type;
      return matchesQuery && matchesType;
    });
  });

  readonly totalSeatsAvailable = computed(() =>
    this.filteredTrains().reduce((acc, t) => acc + t.availableSeats, 0)
  );

  setSearchQuery(query: string): void {
    this.searchQuery.set(query);
  }

  setFilterType(type: string): void {
    this.selectedType.set(type);
  }

  bookSeat(trainId: string): void {
    this.trains.update(trains =>
      trains.map(t => (t.id === trainId && t.availableSeats > 0)
        ? { ...t, availableSeats: t.availableSeats - 1 }
        : t
      )
    );
  }
}
```

---

### Étape 3.2 : Simplification du composant `TrainFilterComponent`
1. Ouvrez `src/app/components/train-filter/train-filter.component.ts`.
2. Montrez le boilerplate : `destroy$`, `ngOnDestroy`, `takeUntil`.
3. Lancez Copilot Inline Edit (`Ctrl + \`).

### 💬 Prompt :
```text
Adapte ce composant pour consommer directement les signals du TrainService.
Supprime complètement le Subject destroy$, takeUntil et ngOnDestroy, car ils sont devenus inutiles avec les signals.
```

### Ce que vous dites à voix haute :
> *"Remarquez comment Copilot identifie que `destroy$`, `takeUntil` et l'interface `OnDestroy` sont désormais du code mort. Moins de code = moins de bugs et zéro risque de fuite mémoire."*

---

## 🎨 Acte 4 : Modernisation des templates (Nouveau Control Flow) (3 min)

### Objectif :
Migrer la syntaxe des templates Angular de `*ngIf` / `*ngFor` vers `@if` / `@for` / `@empty`.

### Action dans IntelliJ :
1. Ouvrez `src/app/components/train-list/train-list.component.html`.
2. Ouvrez le chat ou sélectionnez le fichier entier pour Inline Edit (`Ctrl + \`).

### 💬 Prompt :
```text
Migre ce template HTML vers la nouvelle syntaxe de Control Flow intégrée d'Angular (@if, @else, @for, @empty).
Puisque le composant utilise désormais des Signals, appelle 'trains()' et 'isLoading()'.
Utilise 'track train.id' pour le bloc @for.
Préserve scrupuleusement tous les composants WCS SNCF (<wcs-card>, <wcs-button>, <wcs-badge>, <wcs-spinner>) et leurs attributs.
```

### Ce que vous dites à voix haute :
> *"Angular a introduit un moteur de template beaucoup plus clair et performant. Fini le `*ngIf` avec des balises `<ng-template #elseBlock>`, fini le `*ngFor` avec son pipe async.
> Regardez comme le template devient élégant avec `@if`, `@for` et le bloc `@empty` natif qui gère le cas où aucun train n'est disponible !"*

### Résultat attendu :
```html
@if (isLoading()) {
  <div class="loading-state">
    <wcs-spinner></wcs-spinner>
    <p>Recherche des trains en cours...</p>
  </div>
} @else {
  <div class="train-cards-grid">
    @for (train of trains(); track train.id) {
      <div class="train-item">
        <wcs-card>
          ...
        </wcs-card>
      </div>
    } @empty {
      <div class="empty-state">
        <p>Aucun train ne correspond à vos critères de recherche.</p>
      </div>
    }
  </div>
}
```

---

## 🌟 Acte 5 : L'effet "Waouh" : Complétion contextuelle & Génération de Tests (3 min)

### Option A : Génération en un clic d'un test unitaire avec Signals
1. Ouvrez `src/app/services/train.service.ts`.
2. Dans Copilot Chat, tapez :
   ```text
   /tests Génère les tests unitaires Jasmine/Karma pour TrainService modernisé avec les signals.
   Teste notamment :
   1. Le filtrage réactif quand 'searchQuery' ou 'selectedType' change.
   2. Le décompte des places disponibles avec 'bookSeat'.
   ```
3. Montrez la qualité des assertions (`expect(service.totalSeatsAvailable()).toBe(...)`).

### Option B : Complétion inline en temps réel d'un nouveau Web Component WCS
1. Dans `train-list.component.html`, juste sous le prix, commencez à taper :
   ```html
   <!-- Afficher une alerte si moins de 5 places -->
   ```
2. Appuyez sur `Entrée` et observez la suggestion de Copilot proposant automatiquement :
   ```html
   <wcs-badge *ngIf="train.availableSeats <= 5" color="warning">Dernières places !</wcs-badge>
   ```
3. Appuyez sur `Tab` pour accepter.

---

## 🏆 Conclusion & Clôture de la présentation (2 min)

### Points clés à résumer :
1. **Gain de temps** : Ce qui prenait 1 heure de refactoring manuel et de vérification de syntaxe se fait en 5 à 10 minutes.
2. **Context-Awareness** : Copilot comprend la spécificité des frameworks (Angular Standalone, Signals) et des librairies tierces (Web Components SNCF WCS avec `CUSTOM_ELEMENTS_SCHEMA`).
3. **Synergie avec IntelliJ IDEA** : Les diffs interactifs, l'inline chat (`Ctrl + \`), le terminal intégré et la gestion Git rendent l'expérience fluide et sûre.

---

## 🛡️ Checklist de préparation avant la démo (Anti-bug)

- [ ] Vérifier que le plugin GitHub Copilot dans IntelliJ est bien connecté avec un compte actif.
- [ ] Ouvrir le projet dans IntelliJ IDEA au préalable pour que l'indexation soit terminée.
- [ ] Préparer les fichiers ouverts dans les onglets : `package.json`, `app.module.ts`, `train.service.ts`, `train-list.component.html`.
- [ ] Avoir une copie locale du projet ou une branche git de secours (`git branch backup-demo`) au cas où vous souhaiteriez réinitialiser en 1 seconde (`git reset --hard HEAD`).
