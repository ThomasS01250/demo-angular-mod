import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <header class="app-header">
      <div class="header-inner">
        <div class="brand">
          <span class="logo-sncf">SNCF</span>
          <span class="app-name">Plateforme Démo Migration Copilot</span>
        </div>
        <div class="version-tag">
          <span>Angular Legacy (NgModule + RxJS)</span>
        </div>
      </div>
    </header>

    <main class="container">
      <app-train-filter></app-train-filter>
      <app-train-list></app-train-list>
    </main>
  `,
  styles: [`
    .app-header {
      background-color: #002244;
      color: #ffffff;
      padding: 16px 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-inner {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo-sncf {
      background-color: #c90035;
      color: white;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 4px;
      letter-spacing: 1px;
    }

    .app-name {
      font-size: 1.1rem;
      font-weight: 600;
    }

    .version-tag span {
      font-size: 0.8rem;
      background-color: rgba(255, 255, 255, 0.15);
      padding: 4px 10px;
      border-radius: 12px;
    }
  `]
})
export class AppComponent {
  title = 'SNCF - Démo Migration Copilot';
}
