import { PackingCategory } from './packingCategory';

export interface PackingPerson {
  id: string;
  name: string;
  categories: PackingCategory[];
}

export type DbPackingPerson = {
  id: string;
  name: string;
  list_id: string;
};
