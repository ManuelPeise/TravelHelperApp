import { PackingItem } from './packingItem';

export type PackingCategory = {
  id: string;
  name: string;
  items: PackingItem[];
  person_id: string;
};

export type DbPackingCategory = {
  id: string;
  name: string;
  person_id: string;
};
