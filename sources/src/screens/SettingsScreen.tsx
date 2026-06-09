import DropdownInput from '@/components/DropdownInput';
import SwitchComponent from '@/components/SwitchComponent';
import { useForm } from '@/hooks/useForm';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { SupportedCurrencies } from '@/lib/constants';
import { CurrencyEnum } from '@/lib/enums/CurrencyEnum';
import { Settings } from '@/lib/types/Settings';
import React from 'react';
import { Text, View } from 'react-native';

const SettingsScreen: React.FC = () => {
  const { appTheme, settings, saveOrUpdateSettings } = useSettingsContext();

  const { values, handleChange } = useForm<Settings>({
    id: 1,
    sourceCurrency: (settings?.sourceCurrency as CurrencyEnum) || null,
    targetCurrency: (settings?.targetCurrency as CurrencyEnum) || null,
    theme: settings?.theme || 'system',
  });

  const handleSettingsChange = React.useCallback(
    (field: keyof Settings, value: any) => {
      handleChange(field, value);
      saveOrUpdateSettings({ ...values, [field]: value });
    },
    [saveOrUpdateSettings, values],
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
        <DropdownInput
          options={SupportedCurrencies}
          label="Quellwährung"
          value={values.sourceCurrency}
          onValueChange={value => handleSettingsChange('sourceCurrency', value)}
        />
      </View>
      <View
        style={{
          width: '100%',
          padding: 20,
          backgroundColor: appTheme.card,
          borderRadius: 0,
        }}
      >
        <DropdownInput
          options={SupportedCurrencies.filter(c => c !== values.sourceCurrency)}
          label="Zielwährung"
          value={values.targetCurrency}
          onValueChange={value => handleSettingsChange('targetCurrency', value)}
        />
      </View>
      <View
        style={{
          width: '100%',
          padding: 20,
          backgroundColor: appTheme.card,
          borderRadius: 0,
        }}
      >
        <SwitchComponent
          label="Dark Mode"
          value={values.theme === 'dark'}
          onValueChange={value =>
            handleSettingsChange('theme', value ? 'dark' : 'light')
          }
        />
      </View>
    </View>
  );
};

export default SettingsScreen;
