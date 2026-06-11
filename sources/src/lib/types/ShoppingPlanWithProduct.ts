import { ShoppingPlan } from './ShoppingPlan';

export type ShoppingPlanWithProduct = ShoppingPlan & {
  productName: string;
  productCategory: string;
};
