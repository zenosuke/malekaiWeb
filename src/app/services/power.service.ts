import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { Power } from '../data';

import { environment } from '../../environments/environment';

@Injectable()
export class PowerService {

  static get urlSeg(): string { return '/powers'; }
  get url(): string { return environment.apiUrl + PowerService.urlSeg; }

  private _cache: Power[] = [];
  public get cache(): Power[] { return this._cache.map(a => new Power(a)); }

  private noop = () => undefined;

  constructor(private http: Http) { }

  private handleError(res: Response) {
    return Observable.throw(res.statusText); // parse res.text, res.json().message, etc
  }

  getAll(): Observable<Power[]> {
    const obs = this.http.get(this.url)
                .map(res => {
                  const a = res.json() as any[];
                  return a.map(b => Power.deserialize(b));
                })
                .catch(err => this.handleError(err))
                .publish();
      obs.toPromise().then(powers => this._cache = powers, this.noop);
      obs.connect();
      return obs;
  }

  get(name: string): Observable<Power> {
    const obs = this.http.get(this.url + '/' + btoa(name))
                .map(res => Power.deserialize(res.json()))
                .catch(err => this.handleError(err))
                .publish();
    // obs.toPromise().then(disc => null, this.noop); -- update the cache
    obs.connect();
    return obs;
  }
}
