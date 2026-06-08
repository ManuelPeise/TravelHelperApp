import { CurrencyEnum } from './enums/CurrencyEnum';

export const ExchangeRateAPI =
  'https://api.frankfurter.app/latest?from=EUR&to={toString}';

export const SupportedCurrencies = Object.values(CurrencyEnum).sort((a, b) =>
  a.localeCompare(b),
);
