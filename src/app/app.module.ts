import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { WcsAngularModule } from 'wcs-angular';

import { AppComponent } from './app.component';
import { TrainListComponent } from './components/train-list/train-list.component';
import { TrainFilterComponent } from './components/train-filter/train-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    TrainListComponent,
    TrainFilterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    WcsAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
