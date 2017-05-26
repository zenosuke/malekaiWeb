import { IDataObject } from './interfaces';

export class Race implements IDataObject {

  get dataType(): string { return 'Race'; }
  get baseType(): string { return 'Race'; }

  name: string;
  description: string;
  icon: string;
  classes: string[];

  static deserialize(obj: any): Race {
    const r = new Race();
    r.name = obj.name || '';
    r.description = obj.description || '';
    r.icon = obj.icon || '';
    r.classes = obj.classes instanceof Array ? obj.classes.slice() : [];
    return r;
  }

  constructor(race?: Race) {
    if(race != null) {
      this.name = race.name || '';
      this.description = race.description || '';
      this.icon = race.icon || '';
      this.classes = race.classes ? race.classes.slice() : [];
    } else {
      this.name = '';
      this.description = '';
      this.icon = '';
      this.classes = [];
    }
  }

  serialize(): any {
    return {
      name: this.name,
      description: this.description,
      icon: this.icon,
      classes: this.classes.slice()
    };
  }

  setTo(other): void {
    if(!(other instanceof Race)) return;

    this.name = other.name;
    this.description = other.description;
    this.icon = other.icon;
    this.classes = other.classes.slice();
  }

  clone(): Race {
    return new Race(this);
  }
}
