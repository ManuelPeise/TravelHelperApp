import { ExchangeRate } from '../types/ExChangeRate';
import { getDatabase } from './SqliteDb';

const getExchangeRatesFromDb = async (
  date: string,
): Promise<ExchangeRate[]> => {
  const db = await getDatabase();
  const [results] = await db.executeSql(
    'SELECT * FROM exchange_rates WHERE date = ?',
    [date],
  );

  const exchangeRates: ExchangeRate[] = [];

  for (let i = 0; i < results.rows.length; i++) {
    exchangeRates.push(results.rows.item(i));
  }

  return exchangeRates;
};

const addExchangeRate = async (
  exchangeRate: Omit<ExchangeRate, 'id'>,
  updateExisting = false,
): Promise<void> => {
  const db = await getDatabase();
  if (updateExisting) {
    await db.executeSql(
      'INSERT OR REPLACE INTO exchange_rates (currency, value, date) VALUES (?, ?, ?)',
      [exchangeRate.currency, exchangeRate.value, exchangeRate.date],
    );
  } else {
    await db.executeSql(
      'INSERT INTO exchange_rates (currency, value, date) VALUES (?, ?, ?)',
      [exchangeRate.currency, exchangeRate.value, exchangeRate.date],
    );
  }
};

const saveExchangeRatesToDb = async (
  exchangeRates: Omit<ExchangeRate, 'id'>[],
  updateExisting = false,
): Promise<void> => {
  for (const exchangeRate of exchangeRates) {
    await addExchangeRate(exchangeRate, updateExisting);
  }
};

export { getExchangeRatesFromDb, addExchangeRate, saveExchangeRatesToDb };
