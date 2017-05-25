import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { Issue } from '../data';

import { environment } from '../../environments/environment';

@Injectable()
export class MetaService {

  static get urlSeg(): string { return '/meta'; }
  get url(): string { return environment.apiUrl + MetaService.urlSeg; }

  private noop = () => undefined;

  constructor(private http: Http) { }

  private handleError(res: Response) {
    return Observable.throw(res.statusText); // parse res.text, res.json().message, etc
  }

  postIssue(issue: Issue): Observable<Response> {
    const obs = this.http.post(this.url + '/issue', JSON.stringify(issue.serialize()))
                .catch(err => this.handleError(err))
                .publish();
    // obs.toPromise().then(disc => null, this.noop); -- update the cache
    obs.connect();
    return obs;
  }
}
