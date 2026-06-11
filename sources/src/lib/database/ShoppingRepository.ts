import { getDatabase } from './SqliteDb';
import { Shopping } from '../types/Shopping';
import { Product } from '../types/Product';
import { ShoppingPlan } from '../types/ShoppingPlan';
import { ShoppingPlanWithProduct } from '../types/ShoppingPlanWithProduct';
import { ProductCategoryResourceEnum } from '../enums/ProductCategoryResourceEnum';

const getAllShoppingLists = async (): Promise<Shopping[]> => {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    'SELECT * FROM shopping ORDER BY date DESC',
  );
  const lists: Shopping[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    lists.push(result.rows.item(i));
  }
  return lists;
};

const createShoppingList = async (name: string): Promise<number> => {
  const db = await getDatabase();
  const date = new Date().toISOString();
  const [result] = await db.executeSql(
    'INSERT INTO shopping (name, date) VALUES (?, ?)',
    [name, date],
  );
  return result.insertId;
};

const deleteShoppingList = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.executeSql('DELETE FROM shopping_plan WHERE fk_shoppingId = ?', [
    id,
  ]);
  await db.executeSql('DELETE FROM shopping WHERE id = ?', [id]);
};

const getShoppingPlanItems = async (
  shoppingId: number,
): Promise<ShoppingPlanWithProduct[]> => {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    `SELECT
      sp.id,
      sp.fk_shoppingId,
      sp.fk_productId,
      sp.quantity,
      sp.price,
      sp.completed,
      p.name AS productName,
      p.category AS productCategory
    FROM shopping_plan sp
    INNER JOIN product p ON p.id = sp.fk_productId
    WHERE sp.fk_shoppingId = ?
    ORDER BY p.category, p.name`,
    [shoppingId],
  );
  const items: ShoppingPlanWithProduct[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows.item(i);
    items.push({ ...row, completed: row.completed === 1 });
  }
  return items;
};

const searchProducts = async (query: string): Promise<Product[]> => {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    'SELECT * FROM product WHERE name LIKE ? ORDER BY name LIMIT 20',
    [`%${query}%`],
  );
  const products: Product[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    products.push(result.rows.item(i));
  }
  return products;
};

const findOrCreateProduct = async (
  name: string,
  category: ProductCategoryResourceEnum,
): Promise<number> => {
  const db = await getDatabase();
  const [existing] = await db.executeSql(
    'SELECT id FROM product WHERE name = ? AND category = ? LIMIT 1',
    [name, category],
  );
  if (existing.rows.length > 0) {
    return existing.rows.item(0).id;
  }
  const [result] = await db.executeSql(
    'INSERT INTO product (name, category) VALUES (?, ?)',
    [name, category],
  );
  return result.insertId;
};

const addShoppingPlanItem = async (
  item: Omit<ShoppingPlan, 'id'>,
): Promise<void> => {
  const db = await getDatabase();
  await db.executeSql(
    'INSERT INTO shopping_plan (fk_shoppingId, fk_productId, quantity, price, completed) VALUES (?, ?, ?, ?, ?)',
    [
      item.fk_shoppingId,
      item.fk_productId,
      item.quantity,
      item.price,
      item.completed ? 1 : 0,
    ],
  );
};

const updateShoppingPlanItem = async (
  id: number,
  updates: Partial<Pick<ShoppingPlan, 'quantity' | 'price' | 'completed'>>,
): Promise<void> => {
  const db = await getDatabase();
  const fields: string[] = [];
  const values: (number | string)[] = [];

  if (updates.quantity !== undefined) {
    fields.push('quantity = ?');
    values.push(updates.quantity);
  }
  if (updates.price !== undefined) {
    fields.push('price = ?');
    values.push(updates.price);
  }
  if (updates.completed !== undefined) {
    fields.push('completed = ?');
    values.push(updates.completed ? 1 : 0);
  }

  if (fields.length === 0) {
    return;
  }

  values.push(id);
  await db.executeSql(
    `UPDATE shopping_plan SET ${fields.join(', ')} WHERE id = ?`,
    values,
  );
};

const deleteShoppingPlanItem = async (id: number): Promise<void> => {
  const db = await getDatabase();
  await db.executeSql('DELETE FROM shopping_plan WHERE id = ?', [id]);
};

export {
  getAllShoppingLists,
  createShoppingList,
  deleteShoppingList,
  getShoppingPlanItems,
  searchProducts,
  findOrCreateProduct,
  addShoppingPlanItem,
  updateShoppingPlanItem,
  deleteShoppingPlanItem,
};
