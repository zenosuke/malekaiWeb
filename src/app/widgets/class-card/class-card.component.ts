import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Race } from '../../data';

@Component({
  selector: 'malekai-class-card',
  templateUrl: 'class-card.component.html',
  styleUrls: ['../shared/card.component.scss']
})
export class ClassCardComponent {

  @Input() data: Race;
  @Output('search') searchEmitter = new EventEmitter<{ name: string, type: string }>();

  getName(obj: any): string {
    return obj ? obj.name : '';
  }

  search(name, type): void {
    this.searchEmitter.emit({name: name, type: type});
  }

  getIconStyle(): string {
    return (this.data && this.data.icon) ? `url(${this.data.icon})` || '' : '';
  }

  exists(item: any): boolean {
    if(item instanceof Array) return item.length > 0;
    if(typeof item === 'string') return item.length > 0;
    if(typeof item === 'number') return item > 0;
    else return item != null;
  }
}
