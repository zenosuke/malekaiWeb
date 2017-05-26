import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdAutocomplete } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { CacheService } from '../../services';
import { IDataObject } from '../../data/interfaces';

@Component({
  selector: 'malekai-quick-search',
  templateUrl: 'quick-search.component.html',
  styleUrls: ['quick-search.component.scss']
})
export class QuickSearchComponent implements OnInit, OnDestroy {

  @ViewChild('input') _input: ElementRef;
  get input(): HTMLInputElement { return this._input ? this._input.nativeElement : null; }

  @ViewChild('auto') autoComplete: MdAutocomplete;

  inputController: FormControl = new FormControl();

  latestFilteredObjects: IDataObject[] = [];
  filterSubject: BehaviorSubject<IDataObject[]> = new BehaviorSubject<IDataObject[]>([]);
  filteredObjects: Observable<IDataObject[]>;

  currentType: string;
  currentFilterValue: string;

  objects: IDataObject[] = [];
  types: string[] = ['Race', 'Class', 'Discipline', 'Power'];

  private subs: Subscription[] = [];

  constructor(private cacheService: CacheService) { }

  ngOnInit() {
    this.subs.push(this.cacheService.onUpdate.subscribe(() => {
      this.objects = this.cacheService.getEverything()
                              .sort((a, b) => (a.name).localeCompare(b.name));
      this.updateFilteredObjects();
    }));

    this.objects = this.cacheService.getEverything()
                              .sort((a, b) => (a.name).localeCompare(b.name));

    this.latestFilteredObjects = this.objects;
    this.currentFilterValue = '';

    this.inputController.valueChanges.startWith(null).subscribe(obj => {
      this.currentFilterValue = obj && typeof obj === 'object' ? obj.name : obj;
      this.updateFilteredObjects();
    });
    this.filteredObjects = this.filterSubject.asObservable();
    this.updateFilteredObjects();
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  private updateFilteredObjects(): void {
    this.latestFilteredObjects = this.currentFilterValue ? this.filter(this.currentFilterValue) : this.objects;
    this.latestFilteredObjects = this.latestFilteredObjects.slice(0, 100);
    this.filterSubject.next(this.latestFilteredObjects);
  }

  private filter(val: string): IDataObject[] {
    return this.objects.filter(a => new RegExp(`^${val}`, 'gi').test(a.name));
  }

  getName(obj: any): string {
    return obj ? obj.name : '';
  }

  submit(): void {
    if(this.input) this.input.blur();
    this.autoComplete.showPanel = false;
    // navigate to `/` (all) with params
  }

  clear(): void {
    this.inputController.setValue(null);
  }

  keydown(input: KeyboardEvent): void {
    if(input.key === 'Enter' || input.keyCode === 13) {
      if(!(this.inputController.value && typeof this.inputController.value === 'object'))
        this.inputController.setValue(this.latestFilteredObjects[0]);
      this.submit();
    } else if(input.key === 'Esc' || input.key === 'Escape' || input.keyCode === 23) {
      this.clear();
    }
  }

}
