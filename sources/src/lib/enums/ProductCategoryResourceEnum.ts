export enum ProductCategoryResourceEnum {
  FruitsAndVegetables = 'labelFruitsAndVegetables',
  DairyAndFresh = 'labelDairyAndFresh',
  MeatAndFish = 'labelMeatAndFish',
  Bakery = 'labelBakery',
  Pantry = 'labelPantry',
  Beverages = 'labelBeverages',
  Snacks = 'labelSnacks',
  Frozen = 'labelFrozen',
  Household = 'labelHousehold',
  PersonalCare = 'labelPersonalCare',
  PetSupplies = 'labelPetSupplies',
  Other = 'labelOther',
}

type ProductCategoryResourceMap = {
  key: ProductCategoryResourceEnum;
  label: string;
};

export const mapProductCategoryToResource = (
  callback: (key: ProductCategoryResourceEnum) => string,
): ProductCategoryResourceMap[] => {
  return Object.values(ProductCategoryResourceEnum)
    .map(category => ({
      key: category,
      label: callback(category),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

export const getProductCategoryName = (
  category: ProductCategoryResourceEnum,
  callback: (key: ProductCategoryResourceEnum) => string,
): string => {
  return callback(category);
};
