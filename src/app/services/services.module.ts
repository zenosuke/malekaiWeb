import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { CacheService } from './cache.service';
import { ErrorService } from './error.service';

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
    CacheService,
    ErrorService,

    RaceService,
    ClassService,
    DisciplineService,
    PowerService,

    MetaService,

    MalekaiService
  ]
})
export class ServicesModule { }
