import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { CacheService } from './cache.service';
import { ErrorService } from './error.service';
import { Power } from '../data';

import { environment } from '../../environments/environment';

@Injectable()
export class PowerService {

  static get urlSeg(): string { return '/powers'; }
  get url(): string { return environment.apiUrl + PowerService.urlSeg; }
  get type(): string { return 'Power'; }

  private noop = () => undefined;

  constructor(private http: Http, private cacheService: CacheService,
              private errorService: ErrorService) { }

  private handleError(res: Response) {
    return this.errorService.handleError(res); // parse res.text, res.json().message, etc
  }

  getAll(): Observable<Power[]> {
    const obs = this.http.get(this.url)
                .map(res => {
                  const a = res.json() as any[];
                  return a.map(b => Power.deserialize(b));
                })
                .catch(err => this.handleError(err))
                .publish();
      obs.toPromise().then(powers => this.cacheService.updateAllOfType(this.type, powers), this.noop);
      obs.connect();
      return obs;
  }

  get(name: string): Observable<Power> {
    const obs = this.http.get(this.url + '/' + btoa(name))
                .map(res => Power.deserialize(res.json()))
                .catch(err => this.handleError(err))
                .publish();
    obs.toPromise().then(power => this.cacheService.update(power), this.noop);
    obs.connect();
    return obs;
  }
}
