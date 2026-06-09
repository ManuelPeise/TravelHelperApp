import { useApi } from '@/hooks/useApi';
import { ExchangeRateAPI, SupportedCurrencies } from '@/lib/constants';
import React from 'react';
import { ActivityIndicator } from 'react-native';

export type ExchangeRates = {
  amount: number;
  date: string;
  rates: Record<string, number>;
};

export type CurrencyConversionContextModel = {
  supportedCurrencies: string[];
  onSourceAmountChange: (
    amount: number,
    sourceCurrency: string,
    targetCurrency: string,
  ) => number;
};

export const CurrencyConversionContext =
  React.createContext<CurrencyConversionContextModel>({
    supportedCurrencies: SupportedCurrencies,
    onSourceAmountChange: () => 0,
  });

interface IProps extends React.PropsWithChildren {}

const CurrencyConversionProvider: React.FC<IProps> = ({ children }) => {
  const [rates, setRates] = React.useState<Record<string, number>>({});

  const { data, isLoading } = useApi<ExchangeRates>({
    url: ExchangeRateAPI.replace('{toString}', SupportedCurrencies.join(',')),
    method: 'GET',
    sendRequestOnLoad: true,
  });

  const onSourceAmountChange = React.useCallback(
    (amount: number, sourceCurrency: string, targetCurrency: string) => {
      const sourceRate = rates[sourceCurrency];

      const targetRate = rates[targetCurrency];

      if (!sourceRate || !targetRate) {
        return 0;
      }

      const convertedAmount = (amount / sourceRate) * targetRate;

      return convertedAmount;
    },
    [rates],
  );

  React.useEffect(() => {
    if (data) {
      const ratesWithEur: Record<string, number> = {
        EUR: 1,
        ...data.rates,
      };
      setRates(ratesWithEur);
    }
  }, [data]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <CurrencyConversionContext.Provider
      value={{
        onSourceAmountChange: onSourceAmountChange,
        supportedCurrencies: SupportedCurrencies,
      }}
    >
      {children}
    </CurrencyConversionContext.Provider>
  );
};

export default CurrencyConversionProvider;
