import { ExchangeRate } from '@/lib/types/ExChangeRate';
import { useEffect, useState } from 'react';
import { useApi } from './useApi';
import { ExchangeRateAPI } from '@/lib/constants';
import {
  getExchangeRatesFromDb,
  saveExchangeRatesToDb,
} from '@/lib/database/ExchangeRateRepository';
import { SupportedCurrencies } from '@/lib/constants';

export type ExchangeRatesResponse = {
  amount: number;
  date: string;
  rates: {
    DKK: number;
    USD: number;
  };
};

export const useExchangeRates = () => {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);

  const { data, isLoading, error, fetchData } = useApi<ExchangeRatesResponse>({
    url: ExchangeRateAPI.replace('{toString}', SupportedCurrencies.join(',')),
    method: 'GET',
    sendRequestOnLoad: true,
  });

  useEffect(() => {
    const currentDate = new Date();

    getExchangeRatesFromDb(currentDate.toISOString().split('T')[0] ?? '').then(
      async exchangeRates => {
        if (exchangeRates.length) {
          setExchangeRates(exchangeRates);
        } else {
          await fetchData();

          if (data) {
            // save exchange rates to local database
            const rates: ExchangeRate[] = Object.entries(data.rates).map(
              ([currency, value]) => ({
                id: 0,
                currency,
                value,
                date: currentDate.toISOString().split('T')[0] ?? '',
              }),
            );

            await saveExchangeRatesToDb(rates, true);

            setExchangeRates(rates);
          }
        }
      },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return { data: null, isLoading: false, error };
  }

  if (isLoading || !exchangeRates.length) {
    return null;
  }

  return {
    data: exchangeRates,
    isLoading,
    error,
  };
};
