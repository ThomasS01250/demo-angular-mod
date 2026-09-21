import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <wcs-header>
      <div slot="title" class="brand-title">
        <span class="logo-sncf">SNCF</span>
        <span class="app-name">Plateforme Démo Migration Copilot</span>
      </div>
      <div slot="actions">
        <wcs-badge shape="rounded" color="lighter">Angular Legacy (NgModule + RxJS)</wcs-badge>
      </div>
    </wcs-header>

    <main class="container">
      <app-train-filter></app-train-filter>
      <app-train-list></app-train-list>
    </main>
  `,
  styles: [`
    .brand-title {
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
      font-size: 0.9rem;
    }

    .app-name {
      font-size: 1.1rem;
      font-weight: 600;
    }
  `]
})
export class AppComponent {
  title = 'SNCF - Démo Migration Copilot';
}
