import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { MdAutocomplete } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MalekaiService } from '../services';

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

  // get name(): string { return this.lookupForm.controls['name'].value; }
  // set name(s: string) { this.lookupForm.controls['name'].setValue(s); }

  nameMap: {[key: string]: string[]} = {};

  objects: any[] = [];
  latestFilteredObjects: any[] = [];
  filteredObjects: Observable<any[]>;

  get type(): string { return this.lookupForm.controls['type'].value; }
  set type(s: string) { this.lookupForm.controls['type'].setValue(s); }
  types: string[] = ['discipline']; // ['race', 'class', 'discipline', 'power'];

  selected: any;

  subs: Subscription[] = [];

  constructor(private malekaiService: MalekaiService) { }

  ngOnInit() {
    this.objects = this.malekaiService.discCache.sort((a, b) => a.name.localeCompare(b.name));
    this.latestFilteredObjects = this.objects;
    this.type = this.types[0];
    this.subs.push(this.lookupForm.controls['type'].valueChanges.subscribe((s: string) => this.type = s));
    this.filteredObjects = this.lookupForm.controls['object'].valueChanges
                                .startWith(null)
                                .map(obj => obj && typeof obj === 'object' ? obj.name : obj)
                                .map(val => this.latestFilteredObjects = val ? this.filter(val) : this.objects.slice());
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private filter(val: string): string[] {
    return this.objects.filter(a => new RegExp(`^${val}`, 'gi').test(a.name));
  }


  getName(obj: any): string {
    return obj ? obj.name : '';
  }

  submit(): void {
    if(!this.lookupForm.valid) return;
    if(this.nameInput) this.nameInput.blur();
    this.autoComplete.showPanel = false;

    this.selected = this.lookupForm.controls['object'].value;
  }

  keydown(input: KeyboardEvent): void {
    if(input.key === 'Enter' || input.keyCode === 13) {
      if(this.lookupForm.controls['object'].value == null) this.lookupForm.controls['object'].setValue(this.latestFilteredObjects[0]);
      this.submit();
    }
  }

  stringify(value: any, spaces: string | number): string {
    return JSON.stringify(value, null, spaces);
  }

}
