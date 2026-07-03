import React from 'react';
import DropdownInput from '@/components/DropdownInput';
import NumberInput from '@/components/NumberInput';
import { useCurrencyConversion } from '@/hooks/useCurrencyConversion';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useForm } from '@/hooks/useForm';
import { CurrencyConversionFormModel } from '@/lib/types/CurrencyConversionFormModel';
import { useLocalization } from '@/hooks/useLocalization';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CurrencyConversionStackParamList } from '@/lib/types/navigation';

type Props = NativeStackScreenProps<
  CurrencyConversionStackParamList,
  'CurrencyConversionHome'
>;

const CurrencyConversionScreen: React.FC<Props> = props => {
  const { navigation } = props;
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
      style={[
        styles.container,
        { backgroundColor: appTheme.background.primary },
      ]}
    >
      <View
        style={[
          styles.descriptionCard,
          { backgroundColor: appTheme.background.primary },
        ]}
      >
        <Text style={[styles.description, { color: appTheme.text.secondary }]}>
          {getResource('labelCurrencyCalculatorDescription')}
        </Text>
      </View>
      <View
        style={[
          styles.formCard,
          { backgroundColor: appTheme.background.primary },
        ]}
      >
        <View
          style={[
            styles.calculatorContainer,
            { backgroundColor: appTheme.background.primary },
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
                  style={[styles.resultText, { color: appTheme.text.primary }]}
                >
                  {`${fromAmount?.toFixed(2)} ${
                    values.fromCurrency
                  } ≈ ${calculatedRate} ${values.toCurrency}`}
                </Text>
              </View>
            )}
        </View>
      </View>
      <View style={styles.additionalContent}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Impressum')}
        >
          <Text style={[styles.buttonText, { color: appTheme.text.primary }]}>
            {getResource('labelImpressum')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ReportBug')}
        >
          <Text style={[styles.buttonText, { color: appTheme.text.primary }]}>
            {getResource('labelReportBug')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
  },
  descriptionCard: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 38,
  },
  description: {
    marginTop: 4,
  },
  formCard: {
    width: '100%',
    flex: 1,
    padding: 20,
  },
  calculatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    width: '100%',
    borderRadius: 8,
  },
  calculatorResultContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  additionalContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 20,
    width: '100%',
    padding: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    opacity: 0.6,
  },
});

export default CurrencyConversionScreen;
