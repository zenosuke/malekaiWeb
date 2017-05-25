import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { RaceService } from './race.service';
import { ClassService } from './class.service';
import { DisciplineService } from './discipline.service';
import { PowerService } from './power.service';
import { MetaService } from './meta.service';
import { MalekaiService } from './malekai.service';

@NgModule({
  imports: [
    HttpModule
  ],
  providers: [
    RaceService,
    ClassService,
    DisciplineService,
    PowerService,
    MetaService,
    MalekaiService
  ]
})
export class ServicesModule { }
