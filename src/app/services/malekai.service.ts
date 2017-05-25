import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

import { RaceService } from './race.service';
import { ClassService } from './class.service';
import { DisciplineService } from './discipline.service';
import { PowerService } from './power.service';

@Injectable()
export class MalekaiService {

  private _initialized = false;
  private _initializing = false;

  private _onInit: Subject<void> = new Subject<void>();
  private _onInitError: Subject<any> = new Subject<any>();
  private _onUninit: Subject<void> = new Subject<void>();

  public get initialized() { return this._initialized; }
  public get initializing() { return this._initialized; }

  public get onInit() { return this._onInit; }
  public get onInitError() { return this._onInitError; }
  public get onUninit() { return this._onUninit; }

  get raceCache() { return this.raceService.cache; }
  get classCache() { return this.classService.cache; }
  get discCache() { return this.discService.cache; }
  get powerCache() { return this.powerService.cache; }

  constructor(private raceService: RaceService, private classService: ClassService,
              private discService: DisciplineService, private powerService: PowerService) { }

  init(): void {
    if(this._initialized && !this._initializing) return;
    this._initializing = true;

    Promise.all([
      this.raceService.getAll().toPromise(),
      this.classService.getAll().toPromise(),
      this.discService.getAll().toPromise(),
      this.powerService.getAll().toPromise() // page it so we don't have huge requests
    ]).then(stuff => {

      console.log('Initialized!');
      this._initializing = false;
      this._initialized = true;
      this.onInit.next();
    }, err => {
      console.log('Initialization Error!');
      this._initializing = false;
      this.onInitError.next(err);
    });
  }

  uninit(): void {
    if(!this._initialized && !this._initializing) return;
    this._initializing = true;

    console.log('Uninitialized!');
    this._initializing = false;
    this._initialized = false;
    this.onUninit.next();
  }
}
