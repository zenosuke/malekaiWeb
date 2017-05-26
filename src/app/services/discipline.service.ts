import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { CacheService } from './cache.service';
import { ErrorService } from './error.service';
import { Discipline } from '../data';

import { environment } from '../../environments/environment';

@Injectable()
export class DisciplineService {

  static get urlSeg(): string { return '/disciplines'; }
  get url(): string { return environment.apiUrl + DisciplineService.urlSeg; }
  get type(): string { return 'Discipline'; }

  private _cache: Discipline[] = [];
  public get cache(): Discipline[] { return this._cache.map(a => new Discipline(a)); }

  private noop = () => undefined;

  constructor(private http: Http, private cacheService: CacheService,
              private errorService: ErrorService) { }

  private handleError(res: Response) {
    return this.errorService.handleError(res); // parse res.text, res.json().message, etc
  }

  getAll(): Observable<Discipline[]> {
    const obs = this.http.get(this.url)
                .map(res => {
                  const a = res.json() as any[];
                  return a.map(b => Discipline.deserialize(b));
                })
                .catch(err => this.handleError(err))
                .publish();
      obs.toPromise().then(discs => this.cacheService.updateAllOfType(this.type, discs), this.noop);
      obs.connect();
      return obs;
  }

  get(name: string): Observable<Discipline> {
    const obs = this.http.get(this.url + '/' + btoa(name))
                .map(res => Discipline.deserialize(res.json()))
                .catch(err => this.handleError(err))
                .publish();
    obs.toPromise().then(disc => this.cacheService.update(disc), this.noop);
    obs.connect();
    return obs;
  }
}
