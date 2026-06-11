export type ShoppingPlan = {
  id: number;
  fk_shoppingId: number;
  fk_productId: number;
  quantity: number;
  price: number;
  completed: boolean;
};
