import { ProductCategoryResourceEnum } from '../enums/ProductCategoryResourceEnum';

export type Product = {
  id: number;
  category: ProductCategoryResourceEnum;
  name: string;
};
