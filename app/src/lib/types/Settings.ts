import { CurrencyEnum } from '../enums/CurrencyEnum';

export type Settings = {
  id: number;
  sourceCurrency: CurrencyEnum;
  targetCurrency: CurrencyEnum;
  theme: 'system' | 'light' | 'dark';
};
