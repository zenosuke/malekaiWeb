import { IDataObject } from './interfaces';

export class Class implements IDataObject {

  get dataType(): string { return 'Class'; }
  get baseType(): string { return 'Class'; }

  name: string;
  description: string;
  icon: string;
  races: string[];

  static deserialize(obj: any): Class {
    const r = new Class();
    r.name = obj.name || '';
    r.description = obj.description || '';
    r.icon = obj.icon || '';
    r.races = obj.races instanceof Array ? obj.races.slice() : [];
    return r;
  }

  constructor(clas?: Class) {
    if(clas != null) {
      this.name = clas.name || '';
      this.description = clas.description || '';
      this.icon = clas.icon || '';
      this.races = clas.races ? clas.races.slice() : [];
    } else {
      this.name = '';
      this.description = '';
      this.icon = '';
      this.races = [];
    }
  }

  serialize(): any {
    return {
      name: this.name,
      description: this.description,
      icon: this.icon,
      races: this.races.slice()
    };
  }

  setTo(other): void {
    if(!(other instanceof Class)) return;

    this.name = other.name;
    this.description = other.description;
    this.icon = other.icon;
    this.races = other.races.slice();
  }

  clone(): Class {
    return new Class(this);
  }
}
