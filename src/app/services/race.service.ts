import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { CacheService } from './cache.service';
import { ErrorService } from './error.service';
import { Race } from '../data';

import { environment } from '../../environments/environment';

@Injectable()
export class RaceService {

  static get urlSeg(): string { return '/races'; }
  get url(): string { return environment.apiUrl + RaceService.urlSeg; }
  get type(): string { return 'Race'; }

  private noop = () => undefined;

  constructor(private http: Http, private cacheService: CacheService,
              private errorService: ErrorService) { }

  private handleError(res: Response) {
    return this.errorService.handleError(res); // parse res.text, res.json().message, etc
  }

  getAll(): Observable<Race[]> {
    const obs = this.http.get(this.url)
                .map(res => {
                  const a = res.json() as any[];
                  return a.map(b => Race.deserialize(b));
                })
                .catch(err => this.handleError(err))
                .publish();
      obs.toPromise().then(races => this.cacheService.updateAllOfType(this.type, races), this.noop);
      obs.connect();
      return obs;
  }

  get(name: string): Observable<Race> {
    const obs = this.http.get(this.url + '/' + btoa(name))
                .map(res => Race.deserialize(res.json()))
                .catch(err => this.handleError(err))
                .publish();
    obs.toPromise().then(race => this.cacheService.update(race), this.noop);
    obs.connect();
    return obs;
  }
}
