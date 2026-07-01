import { PackingPerson } from './packingPerson';

export type PackingList = {
  id: number;
  title: string;
  subTitle?: string;
  persons: PackingPerson[];
  dateCreated: string;
};
