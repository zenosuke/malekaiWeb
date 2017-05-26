import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MaterialModule } from '../shared';
import { ServicesModule } from '../services';
import { PipesModule } from '../pipes';

import { RaceCardComponent } from './race-card';
import { ClassCardComponent } from './class-card';
import { DisciplineCardComponent } from './discipline-card';
import { PowerCardComponent } from './power-card';
import { QuickSearchComponent } from './quick-search';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,

    MaterialModule,
    ServicesModule,
    PipesModule
  ],
  declarations: [
    RaceCardComponent,
    ClassCardComponent,
    DisciplineCardComponent,
    PowerCardComponent,
    QuickSearchComponent
  ],
  exports: [
    RaceCardComponent,
    ClassCardComponent,
    DisciplineCardComponent,
    PowerCardComponent,
    QuickSearchComponent
  ]
})
export class WidgetsModule { }
