import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { IDataObject } from '../data/interfaces';

import * as levenshtein from 'fast-levenshtein';

@Injectable()
export class CacheService {

  private cache: IDataObject[] = [];

  private _onUpdate: Subject<void> = new Subject<void>();
  private _onTypeUpdates: {[key: string]: Subject<void>} = { };

  private _updateRunner: ReplaySubject<() => void> = new ReplaySubject<() => void>();

  public get onUpdate(): Observable<void> { return this._onUpdate.asObservable(); }

  private _getOnTypeUpdate(key: string): Subject<void> {
    if(this._onTypeUpdates[key] == null)
      this._onTypeUpdates[key] = new Subject<void>();
    return this._onTypeUpdates[key];
  }

  public getOnTypeUpdate(key: string): Observable<void> {
    return this._getOnTypeUpdate(key).asObservable();
  }

  constructor() {
    this._updateRunner.subscribe(foo => {
      foo();
    });
  }

  private _searchCompare(a: any, b: any): number {
    if(typeof a !== typeof b) return 0; // wat
    else if(typeof a === 'string') {
      const aWords = (a as string).split(/\s/).map(x => x.trim());
      const bWords = (b as string).split(/\s/).map(x => x.trim());
      const scores = bWords.map(x => aWords.map(y => levenshtein.get(x, y)).sort((q, w) => w - q).pop());
      let totalScore = 0;
      for(const s of scores) totalScore += s;
      return totalScore / bWords.length;
    }
    else if(typeof a === 'number') return Math.abs(a - b);
    else if(a instanceof Array && b instanceof Array) {
      let totalScore = 0;
      for(const idx in b)
        if(b[idx] != null)
          totalScore += this._searchCompare(a[idx], b[idx]);
      return totalScore / b.length;
    } else return a === b ? 0 : 1000; // arbitrary large number
  }

  private _search(obj: IDataObject, params: { }): number {
    let score = 0;
    for(const k in params) {
      if(params[k] != null)
        score += this._searchCompare(obj[k], params[k]);
    }
    return score;
  }

  private _filter(obj: IDataObject, params: { }): boolean {
    for(const k in params) {
      if(params[k] != null)
        if(obj[k] !== params[k]) return false;
    }
    return true;
  }

  private _match(obj: IDataObject, type?: string, params?: { }): boolean {
    if(type && obj.baseType !== type) return false;
    return params ? this._filter(obj, params) : true;
  }

  random(): IDataObject {
    if(this.cache.length > 0) {
      return this.cache[Math.floor(Math.random() * this.cache.length)].clone();
    }
    return <IDataObject>{ name: 'null', icon: '', baseType: '', dataType: '' };
  }

  get<T extends IDataObject>(type?: string, params?: { }): T {
    return this.cache.find(a => this._match(a, type, params)).clone() as T;
  }

  getAll<T extends IDataObject>(type?: string, params?: { }): T[] {
    return this.cache.filter(a => this._match(a, type, params)).map(a => a.clone() as T);
  }

  filter(params: { }): IDataObject[] {
    return this.cache.filter(obj => this._filter(obj, params));
  }

  /**
   * A lighter version of 'filter' that has lee-way
   * @param params
   */
  search(params: { }): IDataObject[] {
    return this.cache.map(obj => [obj, this._search(obj, params)] as [IDataObject, number])
                    .sort((a, b) => a[1] - b[1])
                    .map(pair => pair[0]);
  }

  getEverything(): IDataObject[] {
    return this.cache.map(a => a.clone());
  }

  update(...objects: IDataObject[]): void {
    this._updateRunner.next(() => this._update(...objects));
  }

  private _update(...objects: IDataObject[]): void {
    const updateTypes: {[key: string]: boolean} = {};
    for(const o of objects) {
      const found = this.cache.find(a => a.name === o.name);
      if(found) found.setTo(o);
      else this.cache.push(o);
      updateTypes[o.baseType] = true;
    }
    this._onUpdate.next();
    for(const t in updateTypes)
      if(updateTypes[t] = true) // shrug
        this._getOnTypeUpdate(t).next();
  }

  updateAllOfType(type: string, objects: IDataObject[]): void {
    this._updateRunner.next(() => this._updateAllOfType(type, objects));
  }

  private _updateAllOfType(type: string, objects: IDataObject[]): void {
    if(objects.length === 0) {
      this.cache = this.cache.filter(a => a.baseType !== type);
      return;
    }

    if(objects[0].baseType !== type) {
      console.error('baseType mismatch: type ' + type + ' is not equal to baseType ' + objects[0].baseType + '!');
      return;
    }

    for(const o of objects) {
      const found = this.cache.find(a => a.name === o.name);
      if(found) found.setTo(o);
      else this.cache.push(o);
    }
    this.cache = this.cache.filter(a => a.baseType !== type || objects.find(b => b.name === a.name));
    this._onUpdate.next();
    this._getOnTypeUpdate(type).next();
  }
}
