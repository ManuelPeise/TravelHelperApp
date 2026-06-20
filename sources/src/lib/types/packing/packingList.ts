import { PackingPerson } from './packingPerson';

export type PackingList = {
  id: string;
  title: string;
  people: PackingPerson[];
};

export type DbPackingList = {
  id: string;
  title: string;
};
