import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { Discipline } from '../data';

import { environment } from '../../environments/environment';

@Injectable()
export class DisciplineService {

  static get urlSeg(): string { return '/disciplines'; }
  get url(): string { return environment.apiUrl + DisciplineService.urlSeg; }

  private _cache: Discipline[] = [];
  public get cache(): Discipline[] { return this._cache.map(a => new Discipline(a)); }

  private noop = () => undefined;

  constructor(private http: Http) { }

  private handleError(res: Response) {
    return Observable.throw(res.statusText); // parse res.text, res.json().message, etc
  }

  getAll(): Observable<Discipline[]> {
    const obs = this.http.get(this.url)
                .map(res => {
                  const a = res.json() as any[];
                  return a.map(b => Discipline.deserialize(b));
                })
                .catch(err => this.handleError(err))
                .publish();
      obs.toPromise().then(discs => this._cache = discs, this.noop);
      obs.connect();
      return obs;
  }

  get(name: string): Observable<Discipline> {
    const obs = this.http.get(this.url + '/' + btoa(name))
                .map(res => Discipline.deserialize(res.json()))
                .catch(err => this.handleError(err))
                .publish();
    // obs.toPromise().then(disc => null, this.noop); -- update the cache
    obs.connect();
    return obs;
  }
}
