import SQLite, { type SQLiteDatabase } from 'react-native-sqlite-storage';
import { saveOrUpdateSettings } from './SettingsRepository';
import { CurrencyEnum } from '../enums/CurrencyEnum';

SQLite.enablePromise(true);

const DB_NAME = 'app.db';

let _db: SQLiteDatabase | null = null;

const getDatabase = async (): Promise<SQLiteDatabase> => {
  if (!_db) {
    _db = await SQLite.openDatabase({ name: DB_NAME, location: 'default' });
  }
  return _db;
};

const initializeDatabase = async (): Promise<void> => {
  const db = await getDatabase();

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sourceCurrency TEXT NOT NULL,
      targetCurrency TEXT NOT NULL,
      theme TEXT NOT NULL
    );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS shopping (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL
    );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS product (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL
    );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS shopping_plan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fk_shoppingId INTEGER NOT NULL,
      fk_productId INTEGER NOT NULL,
      quantity REAL NOT NULL DEFAULT 1,
      price REAL NOT NULL DEFAULT 0,
      completed INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (fk_shoppingId) REFERENCES shopping(id),
      FOREIGN KEY (fk_productId) REFERENCES product(id)
    );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS vocabulary_group (
      id INTEGER PRIMARY KEY AUTOINCREMENT
    );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS vocabulary_word (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      word     TEXT NOT NULL,
      phonetic TEXT,
      lang     TEXT NOT NULL,
      category TEXT,
      FOREIGN KEY (group_id) REFERENCES vocabulary_group(id)
    );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS packing_lists (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL
      );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS packing_people (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        list_id TEXT NOT NULL,
        FOREIGN KEY (list_id) REFERENCES packing_lists (id)
      );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS packing_categories (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        person_id TEXT NOT NULL,
        FOREIGN KEY (person_id) REFERENCES packing_people (id)
      );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS packing_items (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        checked INTEGER NOT NULL DEFAULT 0,
        category_id TEXT NOT NULL,
        FOREIGN KEY (category_id) REFERENCES packing_categories (id)
      );`,
  );

  // try {
  //   await db.executeSql('ALTER TABLE vocabulary_word ADD COLUMN phonetic TEXT');
  // } catch {
  //   // column already exists
  // }

  const [settingsResult] = await db.executeSql(
    'SELECT COUNT(*) as count FROM settings',
  );
  const settingsCount = settingsResult.rows.item(0).count;

  if (settingsCount === 0) {
    await saveOrUpdateSettings(
      {
        sourceCurrency: CurrencyEnum.EUR,
        targetCurrency: CurrencyEnum.DKK,
        theme: 'dark',
      },
      false,
    );
  }
};

const dropDatabase = async (): Promise<void> => {
  const db = await getDatabase();

  if (!db) {
    return;
  }
  await db.close();
  _db = null;
  await SQLite.deleteDatabase({ name: DB_NAME, location: 'default' });
  await initializeDatabase();
  _db = await getDatabase();
};

export { getDatabase, initializeDatabase, dropDatabase };
