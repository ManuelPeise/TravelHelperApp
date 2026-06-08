import { Settings } from '../types/Settings';
import { getDatabase } from './SqliteDb';

const getSettingsFromDb = async (id: number = 1): Promise<Settings> => {
  const db = await getDatabase();
  const [results] = await db.executeSql(
    'SELECT * FROM settings WHERE id = ? LIMIT 1',
    [id],
  );
  const settings = results.rows.item(0);

  return {
    id: settings.id,
    sourceCurrency: settings.sourceCurrency,
    targetCurrency: settings.targetCurrency,
    theme: settings.theme,
  };
};

const saveOrUpdateSettings = async (
  settings: Omit<Settings, 'id'>,
  updateExisting: boolean = false,
): Promise<void> => {
  const db = await getDatabase();

  if (updateExisting) {
    await db.executeSql(
      'INSERT OR REPLACE INTO settings (id, sourceCurrency, targetCurrency, theme) VALUES (1, ?, ?, ?)',
      [settings.sourceCurrency, settings.targetCurrency, settings.theme],
    );
  } else {
    await db.executeSql(
      'INSERT INTO settings (sourceCurrency, targetCurrency, theme) VALUES (?, ?, ?)',
      [settings.sourceCurrency, settings.targetCurrency, settings.theme],
    );
  }
};

export { getSettingsFromDb, saveOrUpdateSettings };
