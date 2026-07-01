import { CurrencyEnum } from './enums/CurrencyEnum';
import { LanguageEnum } from './enums/LanguageEnum';

export const ExchangeRateAPI =
  'https://api.frankfurter.app/latest?from=EUR&to={toString}';

export const SupportedCurrencies = Object.values(CurrencyEnum).sort((a, b) =>
  a.localeCompare(b),
);

export const SupportedLanguages = Object.values(LanguageEnum).sort((a, b) =>
  a.localeCompare(b),
);
