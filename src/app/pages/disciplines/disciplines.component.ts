import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { CacheService } from '../../services';
import { Discipline } from '../../data';

@Component({
  selector: 'malekai-disciplines',
  templateUrl: 'disciplines.component.html',
  styleUrls: ['disciplines.component.scss']
})
export class DisciplinesComponent implements OnInit, OnDestroy {

  items: Discipline[] = [];

  subs: Subscription[] = [];

  constructor(private cacheService: CacheService) { }

  ngOnInit() {
    const type = 'Discipline';
    const params = { type: 'Weapon' };
    this.subs.push(this.cacheService.onUpdate.subscribe(() => {
      this.items = this.cacheService.getAll<Discipline>(type);
    }));
    this.items = this.cacheService.getAll<Discipline>(type);
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}
