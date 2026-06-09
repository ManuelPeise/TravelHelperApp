import { CurrencyConversionContext } from '@/providers/CurrencyConversionProvider';
import React from 'react';

export const useCurrencyConversion = () => {
  const context = React.useContext(CurrencyConversionContext);
  if (!context) {
    throw new Error(
      'useCurrencyConversion must be used within a CurrencyConversionProvider',
    );
  }
  return context;
};
