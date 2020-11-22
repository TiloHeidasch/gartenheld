import { v4 as uuidv4 } from 'uuid';

export class Lager {
  id: string;
  name: string;
  platzs: LagerPlatz[];
  created: Date;
  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.platzs = [];
    this.created = new Date();
  }
}
export class LagerPlatz {
  id: string;
  name: string;
  lagerItems: LagerItem[];
  created: Date;
  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.lagerItems = [];
    this.created = new Date();
  }
}
export class LagerItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  created: Date;
  constructor(name: string, quantity?: number, unit?: string) {
    this.id = uuidv4();
    this.name = name;
    if (quantity !== undefined) {
      this.quantity = quantity;
    } else {
      this.quantity = 0;
    }
    if (unit !== undefined) {
      this.unit = unit;
    } else {
      this.unit = '';
    }
    this.created = new Date();
  }
}
