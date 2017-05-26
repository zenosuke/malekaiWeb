import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { CacheService } from '../../services';
import { IDataObject } from '../../data/interfaces';

@Component({
  selector: 'malekai-all',
  templateUrl: 'all.component.html',
  styleUrls: ['all.component.scss']
})
export class AllComponent implements OnInit, OnDestroy {

  @ViewChild('elInput') _elInput: ElementRef;
  get elInput(): HTMLInputElement { return this._elInput ? this._elInput.nativeElement : null; }

  @ViewChild('elResults') _elResults: ElementRef;
  get elResults(): HTMLDivElement { return this._elResults ? this._elResults.nativeElement : null; }

  inputController: FormControl = new FormControl();

  searchText = 'Looking';
  searchTexts = ['Looking', 'Searching', 'Exploring', 'Studying',
                'Analyzing', 'Seeking', 'Hunting', 'Researching'];

  placeholderText = 'assassin';

  subs: Subscription[] = [];
  results: IDataObject[] = [];
  params: any = { };

  constructor(private cacheService: CacheService) {
    this.searchText = this.searchTexts[Math.floor(Math.random() * this.searchTexts.length)];
  }

  ngOnInit() {
    this.subs.push(this.cacheService.onUpdate.subscribe(() => {
      this.refreshResults();
    }));
    this.subs.push(this.inputController.valueChanges.subscribe(value => {
      if(!value) {
        this.results = [];
        this.params = { };
        this.placeholderText = this.cacheService.random().name;
        return;
      }
      this.parseFilter(value);
      this.refreshResults();
    }));
    this.placeholderText = this.cacheService.random().name;
  }

  search(name: string, type: string): void {
    this.inputController.setValue(`${name}`/* @${type}`*/);
    if(this.results) this.elResults.scrollTop = 0;
  }

  parseFilter(value: string): void {
    value = ('' + value).trim();
    // parse things
    this.params = {
      name: value // leftovers
    };
  }

  refreshResults(): void {
    this.results = this.cacheService.search(this.params).slice(0, 10);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  submit() {
    // only if in 'lite' mode (i.e. using api to search)
  }

  keydown(input: KeyboardEvent): void {
    if(input.key === 'Enter' || input.keyCode === 13) {
      this.submit();
    }
  }
}
