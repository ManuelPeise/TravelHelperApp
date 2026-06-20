export type PackingItem = {
  id: string;
  name: string;
  checked: boolean;
};

export type DbPackingItem = {
  id: string;
  name: string;
  checked: number;
  category_id: string;
};
