import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export interface ErrorResponse extends Response {
  error: string;
}

@Injectable()
export class ErrorService {

  private _onError: Subject<ErrorResponse> = new Subject<ErrorResponse>();
  public get onError() { return this._onError; }

  constructor() { }

  handleError(res: Response): Observable<any> {
    const a: ErrorResponse = res as ErrorResponse;
    a.error = res.statusText;
    this.onError.next(a);
    return Observable.throw(res.statusText);
  }
}
