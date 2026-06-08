import CurrencySelector, {
  ICurrencySelectorProps,
} from '@/components/CurrencySelector';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { SupportedCurrencies } from '@/lib/constants';
import { CurrencyEnum } from '@/lib/enums/CurrencyEnum';
import { SelectableItemModel } from '@/lib/types/SelectableItemModel';
import { Settings } from '@/lib/types/Settings';
import React from 'react';
import { Switch, Text, TouchableOpacity, View } from 'react-native';

const SettingsScreen: React.FC = () => {
  const { appTheme, settings, saveOrUpdateSettings } = useSettingsContext();

  const [currencySecectorProps, setCurrencySelectorProps] =
    React.useState<ICurrencySelectorProps | null>(null);

  const currencyOptions = React.useMemo((): SelectableItemModel[] => {
    return SupportedCurrencies.map(currency => ({
      label: currency,
      value: currency,
    }));
  }, []);

  const onOpenCurrencySelector = (type: 'source' | 'target') => {
    setCurrencySelectorProps({
      open: true,
      label: type === 'source' ? 'Quellwährung wählen' : 'Zielwährung wählen',
      items:
        type === 'source'
          ? currencyOptions
          : currencyOptions.filter(
              item => item.value !== settings?.sourceCurrency,
            ),
      value:
        type === 'source'
          ? settings?.sourceCurrency ?? CurrencyEnum.EUR
          : settings?.targetCurrency ?? CurrencyEnum.DKK,
    });
  };

  const onChangeCurrency = React.useCallback(
    async (value: CurrencyEnum) => {
      const settingsUpdate: Settings = {
        id: settings?.id || 1,
        sourceCurrency: currencySecectorProps?.label.includes('Quellwährung')
          ? value
          : settings?.sourceCurrency || CurrencyEnum.EUR,
        targetCurrency: currencySecectorProps?.label.includes('Zielwährung')
          ? value
          : settings?.targetCurrency || CurrencyEnum.DKK,
        theme: settings?.theme || 'system',
      };
      await saveOrUpdateSettings(settingsUpdate, true);
      setCurrencySelectorProps(null);
    },
    [saveOrUpdateSettings, currencySecectorProps, settings],
  );

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
          Einstellungen
        </Text>
        <Text style={{ color: appTheme.text.secondary, marginTop: 12 }}>
          Hier können Sie Ihre Einstellungen anpassen.
        </Text>
      </View>
      <View
        style={{
          width: '100%',
          padding: 20,
          backgroundColor: appTheme.card,
          borderRadius: 0,
        }}
      >
        <TouchableOpacity
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          onPress={() => onOpenCurrencySelector('source')}
        >
          <Text
            style={{
              color: appTheme.text.primary,
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            Quellwährung
          </Text>
          <Text
            style={{
              color: appTheme.text.primary,
              fontSize: 16,
              paddingRight: 12,
            }}
          >
            {settings?.sourceCurrency || CurrencyEnum.EUR}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: '100%',
          padding: 20,
          backgroundColor: appTheme.card,
          borderRadius: 0,
        }}
      >
        <TouchableOpacity
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          onPress={() => onOpenCurrencySelector('target')}
        >
          <Text
            style={{
              color: appTheme.text.primary,
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            Zielwährung
          </Text>
          <Text
            style={{
              color: appTheme.text.primary,
              fontSize: 16,
              paddingRight: 12,
            }}
          >
            {settings?.targetCurrency || CurrencyEnum.DKK}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: '100%',
          padding: 20,
          backgroundColor: appTheme.card,
          borderRadius: 0,
        }}
      >
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: appTheme.text.primary,
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            Theme (hell / dunkel)
          </Text>

          <Switch
            value={settings?.theme === 'dark'}
            onValueChange={value => {
              const newTheme = value ? 'dark' : 'light';
              const settingsUpdate: Settings = {
                id: settings?.id || 1,
                sourceCurrency: settings?.sourceCurrency || CurrencyEnum.EUR,
                targetCurrency: settings?.targetCurrency || CurrencyEnum.DKK,
                theme: newTheme,
              };
              saveOrUpdateSettings(settingsUpdate, true);
            }}
          />
        </View>
      </View>
      {currencySecectorProps && (
        <CurrencySelector
          {...currencySecectorProps}
          onClose={() => setCurrencySelectorProps(null)}
          onChange={onChangeCurrency}
        />
      )}
    </View>
  );
};

export default SettingsScreen;
