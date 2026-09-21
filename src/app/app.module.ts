import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

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
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
