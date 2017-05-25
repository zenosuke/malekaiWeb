import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MaterialModule } from './shared';
import { ServicesModule } from './services';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LookupComponent } from './lookup';

@NgModule({
  declarations: [
    AppComponent,
    LookupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,

    MaterialModule,
    ServicesModule,

    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
