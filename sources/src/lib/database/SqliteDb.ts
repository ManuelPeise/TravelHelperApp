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

  const [settingsResult] = await db.executeSql(
    'SELECT COUNT(*) as count FROM settings',
  );
  const settingsCount = settingsResult.rows.item(0).count;

  if (settingsCount === 0) {
    await saveOrUpdateSettings(
      {
        sourceCurrency: CurrencyEnum.EUR,
        targetCurrency: CurrencyEnum.DKK,
        theme: 'system',
      },
      false,
    );
  }
};

export { getDatabase, initializeDatabase };
