import React from 'react';
import DropdownInput from '@/components/DropdownInput';
import NumberInput from '@/components/NumberInput';
import { useCurrencyConversion } from '@/hooks/useCurrencyConversion';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { View, Text, StyleSheet } from 'react-native';
import { useForm } from '@/hooks/useForm';
import { CurrencyConversionFormModel } from '@/lib/types/CurrencyConversionFormModel';
import { useLocalization } from '@/hooks/useLocalization';

const CurrencyConversionScreen: React.FC = () => {
  const { appTheme, settings } = useSettingsContext();
  const { getResource } = useLocalization();

  const { values, handleChange, resetForm, isModified } =
    useForm<CurrencyConversionFormModel>({
      fromCurrency: settings?.sourceCurrency || null,
      fromAmount: null,
      toCurrency: null,
    });

  const { supportedCurrencies, onSourceAmountChange } = useCurrencyConversion();

  const calculatedRate = React.useMemo(() => {
    if (
      !isModified ||
      !values.fromCurrency ||
      !values.toCurrency ||
      !values.fromAmount
    ) {
      return null;
    }

    return onSourceAmountChange(
      values.fromAmount,
      values.fromCurrency,
      values.toCurrency,
    ).toFixed(2);
  }, [values, isModified, onSourceAmountChange]);

  const handleSourceCurrencyChange = React.useCallback(
    (currency: string) => {
      resetForm();
      handleChange('fromCurrency', currency);
    },
    [handleChange, resetForm],
  );

  const fromAmount = React.useMemo(() => {
    if (values.fromAmount === null) {
      return null;
    }

    return Number(values.fromAmount);
  }, [values.fromAmount]);

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: appTheme.background.primary,
        gap: 10,
      }}
    >
      <View
        style={{
          width: '100%',
          padding: 20,
          backgroundColor: appTheme.card,
          borderRadius: 0,
        }}
      >
        <Text
          style={{
            color: appTheme.text.secondary,
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          {getResource('titleCurrencyCalculator')}
        </Text>
        <Text style={{ color: appTheme.text.secondary, marginTop: 12 }}>
          {getResource('labelCurrencyCalculatorDescription')}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: appTheme.card,
          width: '100%',
          flex: 1,
          borderRadius: 8,
          padding: 20,
        }}
      >
        <View
          style={[
            styles.calculatorContainer,
            { backgroundColor: appTheme.card },
          ]}
        >
          <DropdownInput
            label={getResource('labelSourceCurrency')}
            options={supportedCurrencies}
            value={values.fromCurrency}
            onValueChange={handleSourceCurrencyChange}
          />
          <NumberInput
            value={fromAmount?.toString() || null}
            onChange={value => handleChange('fromAmount', value)}
            placeholder={getResource('placeholderEnterAmount').replace(
              '{currency}',
              values.fromCurrency || '',
            )}
            placeholderTextColor={appTheme.text.secondary}
            color={appTheme.text.primary}
            hasClearButton={true}
            onClear={() => handleChange('fromAmount', null)}
          />
          <DropdownInput
            label={getResource('labelTargetCurrency')}
            options={supportedCurrencies.filter(c => c !== values.fromCurrency)}
            value={values.toCurrency}
            onValueChange={value => handleChange('toCurrency', value)}
          />
          {values.fromCurrency &&
            fromAmount != null &&
            values.toCurrency &&
            calculatedRate !== null && (
              <View style={styles.calculatorResultContainer}>
                <Text
                  style={{
                    color: appTheme.text.primary,
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                >
                  {`${fromAmount?.toFixed(2)} ${
                    values.fromCurrency
                  } ≈ ${calculatedRate} ${values.toCurrency}`}
                </Text>
              </View>
            )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  calculatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    // marginTop: 20,
  },
  calculatorResultContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CurrencyConversionScreen;
