import React from 'react';
import {
  getShoppingPlanItems,
  addShoppingPlanItem,
  updateShoppingPlanItem,
  deleteShoppingPlanItem,
  findOrCreateProduct,
  searchProducts,
} from '@/lib/database/ShoppingRepository';
import { ShoppingPlan } from '@/lib/types/ShoppingPlan';
import { ShoppingPlanWithProduct } from '@/lib/types/ShoppingPlanWithProduct';
import { ProductCategoryResourceEnum } from '@/lib/enums/ProductCategoryResourceEnum';
import { Product } from '@/lib/types/Product';

const useShoppingList = (shoppingId: number) => {
  const [items, setItems] = React.useState<ShoppingPlanWithProduct[]>([]);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const loadItems = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getShoppingPlanItems(shoppingId);
      setItems(result);
    } finally {
      setIsLoading(false);
    }
  }, [shoppingId]);

  const loadProducts = React.useCallback(async () => {
    try {
      const result = await await searchProducts('');
      setProducts(result);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadItems();
    loadProducts();
  }, [loadItems, loadProducts]);

  const addItem = React.useCallback(
    async (
      productName: string,
      productCategory: ProductCategoryResourceEnum,
      quantity: number,
    ) => {
      const productId = await findOrCreateProduct(productName, productCategory);
      await addShoppingPlanItem({
        fk_shoppingId: shoppingId,
        fk_productId: productId,
        quantity,
        price: 0,
        completed: false,
      });
      await loadItems();
    },
    [shoppingId, loadItems],
  );

  const updateItem = React.useCallback(
    async (
      id: number,
      updates: Partial<Pick<ShoppingPlan, 'quantity' | 'price' | 'completed'>>,
    ) => {
      await updateShoppingPlanItem(id, updates);
      setItems(prev =>
        prev.map(item => (item.id === id ? { ...item, ...updates } : item)),
      );
    },
    [],
  );

  const removeItem = React.useCallback(async (id: number) => {
    await deleteShoppingPlanItem(id);
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const totalPrice = React.useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  return {
    items,
    products,
    isLoading,
    addItem,
    updateItem,
    removeItem,
    totalPrice,
    reload: loadItems,
  };
};

export default useShoppingList;
