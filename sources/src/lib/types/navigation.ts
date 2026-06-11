export type RootTabParamList = {
  CurrencyConversion: undefined;
  Vocabulary: undefined;
  Settings: undefined;
  ShoppingList: undefined;
};

export type ShoppingListStackParamList = {
  ShoppingListOverview: undefined;
  ShoppingListDetail: { shoppingId: number; shoppingName: string };
};
