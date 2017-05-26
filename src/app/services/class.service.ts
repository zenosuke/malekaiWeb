import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { CacheService } from './cache.service';
import { ErrorService } from './error.service';
import { Class } from '../data';

import { environment } from '../../environments/environment';

@Injectable()
export class ClassService {

  static get urlSeg(): string { return '/classes'; }
  get url(): string { return environment.apiUrl + ClassService.urlSeg; }
  get type(): string { return 'Class'; }

  private noop = () => undefined;

  constructor(private http: Http, private cacheService: CacheService,
              private errorService: ErrorService) { }

  private handleError(res: Response) {
    return this.errorService.handleError(res); // parse res.text, res.json().message, etc
  }

  getAll(): Observable<Class[]> {
    const obs = this.http.get(this.url)
                .map(res => {
                  const a = res.json() as any[];
                  return a.map(b => Class.deserialize(b));
                })
                .catch(err => this.handleError(err))
                .publish();
      obs.toPromise().then(classes => this.cacheService.updateAllOfType(this.type, classes), this.noop);
      obs.connect();
      return obs;
  }

  get(name: string): Observable<Class> {
    const obs = this.http.get(this.url + '/' + btoa(name))
                .map(res => Class.deserialize(res.json()))
                .catch(err => this.handleError(err))
                .publish();
    obs.toPromise().then(clas => this.cacheService.update(clas), this.noop);
    obs.connect();
    return obs;
  }
}
