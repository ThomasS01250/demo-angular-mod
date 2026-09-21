import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { defineCustomElements } from 'wcs-core/loader';
import { AppModule } from './app/app.module';

// Enregistrement officiel des Custom Elements WCS SNCF
defineCustomElements();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
