import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { Race } from '../data';

import { environment } from '../../environments/environment';

@Injectable()
export class RaceService {

  static get urlSeg(): string { return '/races'; }
  get url(): string { return environment.apiUrl + RaceService.urlSeg; }

  private _cache: Race[] = [];
  public get cache(): Race[] { return this._cache.map(a => new Race(a)); }

  private noop = () => undefined;

  constructor(private http: Http) { }

  private handleError(res: Response) {
    return Observable.throw(res.statusText); // parse res.text, res.json().message, etc
  }

  getAll(): Observable<Race[]> {
    const obs = this.http.get(this.url)
                .map(res => {
                  const a = res.json() as any[];
                  return a.map(b => Race.deserialize(b));
                })
                .catch(err => this.handleError(err))
                .publish();
      obs.toPromise().then(races => this._cache = races, this.noop);
      obs.connect();
      return obs;
  }

  get(name: string): Observable<Race> {
    const obs = this.http.get(this.url + '/' + btoa(name))
                .map(res => Race.deserialize(res.json()))
                .catch(err => this.handleError(err))
                .publish();
    // obs.toPromise().then(disc => null, this.noop); -- update the cache
    obs.connect();
    return obs;
  }
}
