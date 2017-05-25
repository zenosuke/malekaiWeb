import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { DisciplineService } from './discipline.service';
import { MalekaiService } from './malekai.service';

@NgModule({
  imports: [
    HttpModule
  ],
  providers: [
    DisciplineService,
    MalekaiService
  ]
})
export class ServicesModule { }
