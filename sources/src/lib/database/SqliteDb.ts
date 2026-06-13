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
      lang     TEXT NOT NULL,
      category    TEXT,
      FOREIGN KEY (group_id) REFERENCES vocabulary_group(id)
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
      lang     TEXT NOT NULL,
      topic    TEXT,
      FOREIGN KEY (group_id) REFERENCES vocabulary_group(id)
    );`,
  );

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

export { getDatabase, initializeDatabase };
