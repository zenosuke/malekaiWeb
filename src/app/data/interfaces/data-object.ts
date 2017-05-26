export interface IDataObject {

  name: string;
  icon: string;

  baseType: string;
  dataType: string;

  setTo(other: IDataObject): void;
  clone(): IDataObject;
}
