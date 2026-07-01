import { PackingItem } from './packingItem';

export interface PackingPerson {
  id: number;
  name: string;
  items: PackingItem[];
}
