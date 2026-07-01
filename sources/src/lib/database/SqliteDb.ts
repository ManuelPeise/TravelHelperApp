import SQLite, { type SQLiteDatabase } from 'react-native-sqlite-storage';
import { saveOrUpdateSettings } from './SettingsRepository';
import { CurrencyEnum } from '../enums/CurrencyEnum';
import { LanguageEnum } from '../enums/LanguageEnum';

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
      id INTEGER PRIMARY KEY CHECK (id = 1),
      sourceCurrency TEXT NOT NULL,
      targetCurrency TEXT NOT NULL,
      language TEXT NOT NULL,
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
      FOREIGN KEY (fk_shoppingId) REFERENCES shopping(id) ON DELETE CASCADE,
      FOREIGN KEY (fk_productId) REFERENCES product(id) ON DELETE CASCADE
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
      FOREIGN KEY (group_id) REFERENCES vocabulary_group(id) ON DELETE CASCADE
    );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS packing_lists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        subTitle TEXT,
        dateCreated TEXT NOT NULL
      );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS packing_people (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS packing_list_person (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  personId INTEGER NOT NULL,
  listId INTEGER NOT NULL,
  UNIQUE (personId, listId),
  FOREIGN KEY (personId) REFERENCES packing_people(id) ON DELETE CASCADE,
  FOREIGN KEY (listId) REFERENCES packing_lists(id) ON DELETE CASCADE
);`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS packing_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );`,
  );

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS packing_personal_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        listId INTEGER NOT NULL,
        personId INTEGER NOT NULL,
        itemId INTEGER NOT NULL,
        count INTEGER NOT NULL DEFAULT 1,
        checked INTEGER NOT NULL DEFAULT 0,
        UNIQUE (listId, personId, itemId),
        FOREIGN KEY (listId) REFERENCES packing_lists (id) ON DELETE CASCADE,
        FOREIGN KEY (personId) REFERENCES packing_people (id) ON DELETE CASCADE,
        FOREIGN KEY (itemId) REFERENCES packing_items (id) ON DELETE CASCADE
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
        language: LanguageEnum.ENGLISH,
        theme: 'dark',
      },
      false,
    );
  }
};

const dropDatabase = async (): Promise<void> => {
  const db = await getDatabase();

  await db.close();
  _db = null;
  await SQLite.deleteDatabase({ name: DB_NAME, location: 'default' });
  await initializeDatabase();
  _db = await getDatabase();
};

export { getDatabase, initializeDatabase, dropDatabase };
