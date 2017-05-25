import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { Class } from '../data';

import { environment } from '../../environments/environment';

@Injectable()
export class ClassService {

  static get urlSeg(): string { return '/classes'; }
  get url(): string { return environment.apiUrl + ClassService.urlSeg; }

  private _cache: Class[] = [];
  public get cache(): Class[] { return this._cache.map(a => new Class(a)); }

  private noop = () => undefined;

  constructor(private http: Http) { }

  private handleError(res: Response) {
    return Observable.throw(res.statusText); // parse res.text, res.json().message, etc
  }

  getAll(): Observable<Class[]> {
    const obs = this.http.get(this.url)
                .map(res => {
                  const a = res.json() as any[];
                  return a.map(b => Class.deserialize(b));
                })
                .catch(err => this.handleError(err))
                .publish();
      obs.toPromise().then(classes => this._cache = classes, this.noop);
      obs.connect();
      return obs;
  }

  get(name: string): Observable<Class> {
    const obs = this.http.get(this.url + '/' + btoa(name))
                .map(res => Class.deserialize(res.json()))
                .catch(err => this.handleError(err))
                .publish();
    // obs.toPromise().then(disc => null, this.noop); -- update the cache
    obs.connect();
    return obs;
  }
}
