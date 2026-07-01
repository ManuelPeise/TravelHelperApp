import { CurrencyEnum } from '../enums/CurrencyEnum';
import { LanguageEnum } from '../enums/LanguageEnum';

export type Settings = {
  id: number;
  sourceCurrency: CurrencyEnum;
  targetCurrency: CurrencyEnum;
  language: LanguageEnum;
  theme: 'system' | 'light' | 'dark';
};
