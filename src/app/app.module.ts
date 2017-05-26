import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MaterialModule } from './shared';
import { ServicesModule } from './services';
import { PipesModule } from './pipes';
import { WidgetsModule } from './widgets';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AllComponent } from './pages/all';
import { DisciplinesComponent } from './pages/disciplines';

@NgModule({
  declarations: [
    AppComponent,

    AllComponent,
    DisciplinesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,

    MaterialModule,
    ServicesModule,
    PipesModule,
    WidgetsModule,

    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
