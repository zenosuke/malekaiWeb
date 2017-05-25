import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { MdAutocomplete } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { MalekaiService } from '../services';

import { Race, Class, Discipline, Power } from '../data';

@Component({
  selector: 'malekai-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss']
})
export class LookupComponent implements OnInit {

  @ViewChild('nameInput') _nameInput: ElementRef;
  get nameInput(): HTMLInputElement { return this._nameInput ? this._nameInput.nativeElement : null; }

  @ViewChild('auto') autoComplete: MdAutocomplete;

  lookupForm = new FormGroup ({
    object: new FormControl(),
    type: new FormControl()
  });

  get objectController(): FormControl {
    return this.lookupForm.controls['object'] as FormControl;
  }

  get typeController(): FormControl {
    return this.lookupForm.controls['type'] as FormControl;
  }

  // get name(): string { return this.lookupForm.controls['name'].value; }
  // set name(s: string) { this.lookupForm.controls['name'].setValue(s); }

  objects: any[] = [];

  get objectsForType(): any[] {
    switch(this.currentType) {
      case 'race': return this.objects.filter(a => a instanceof Race);
      case 'class': return this.objects.filter(a => a instanceof Class);
      case 'discipline': return this.objects.filter(a => a instanceof Discipline);
      case 'power': return this.objects.filter(a => a instanceof Power);
      default: return this.objects;
    }
  }

  latestFilteredObjects: any[] = [];
  filterSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  filteredObjects: Observable<any[]>;

  currentType: string;
  currentFilterValue: string;

  types: string[] = ['race', 'class', 'discipline', 'power'];

  selected: any;

  subs: Subscription[] = [];

  constructor(private malekaiService: MalekaiService) { }

  ngOnInit() {
    this.objects = this.objects.concat(this.malekaiService.raceCache)
                              .concat(this.malekaiService.classCache)
                              .concat(this.malekaiService.discCache)
                              .concat(this.malekaiService.powerCache)
                              .sort((a, b) => (a.name as string || '').localeCompare(b.name || ''));

    this.latestFilteredObjects = this.objects;
    this.typeController.setValue(this.currentType = this.types[0]);
    this.currentFilterValue = '';

    this.objectController.valueChanges.startWith(null).subscribe(obj => {
      this.currentFilterValue = obj && typeof obj === 'object' ? obj.name : obj;
      this.updateFilteredObjects();
    });

    this.typeController.valueChanges.startWith(null).subscribe((newType: string) => {
      // check if it's a new type?
      this.currentType = newType || this.currentType;
      this.updateFilteredObjects();
    });
    this.filteredObjects = this.filterSubject.asObservable();
    this.updateFilteredObjects();
  }

  private updateFilteredObjects(): void {
    this.latestFilteredObjects = this.currentFilterValue ? this.filter(this.currentFilterValue) : this.objectsForType;
    this.filterSubject.next(this.latestFilteredObjects);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private filter(val: string): string[] {
    return this.objectsForType.filter(a => new RegExp(`^${val}`, 'gi').test(a.name));
  }


  getName(obj: any): string {
    return obj ? obj.name : '';
  }

  submit(): void {
    if(!this.lookupForm.valid) return;
    if(this.nameInput) this.nameInput.blur();
    this.selected = this.objectController.value;
    this.autoComplete.showPanel = false;
  }

  keydown(input: KeyboardEvent): void {
    if(input.key === 'Enter' || input.keyCode === 13) {
      if(!(this.objectController.value && typeof this.objectController.value === 'object'))
        this.objectController.setValue(this.latestFilteredObjects[0]);
      this.submit();
    }
  }

  stringify(value: any, spaces: string | number): string {
    return JSON.stringify(value, null, spaces);
  }

  search(name, type): void {
    this.currentFilterValue = name;
    this.typeController.setValue(type);
    this.objectController.setValue(this.latestFilteredObjects[0]);
    this.submit();
  }

  getIconStyle(): string {
    return this.selected ? `url(${this.selected.icon})` || '' : '';
  }

  getBaseType(): string {
    if(this.selected == null) return '';
    else if(this.selected instanceof Race) return 'Race';
    else if(this.selected instanceof Class) return 'Class';
    else if(this.selected instanceof Power) return 'Power';
    else if(this.selected instanceof Discipline) return 'Discipline';
    else return '{unknown}';
  }

  getType(): string {
    if(this.selected instanceof Discipline) return ((this.selected as Discipline).type + ' Discipline').trim();
    else return this.getBaseType();
  }

  exists(item: any): boolean {
    if(item instanceof Array) return item.length > 0;
    if(typeof item === 'string') return item.length > 0;
    if(typeof item === 'number') return item > 0;
    else return item != null;
  }

  formatNumber(n: number): string {
    return n > 0 ? `+${n}` : `${n}`;
  }

}
