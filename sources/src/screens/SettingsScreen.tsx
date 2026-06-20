import DropdownInput from '@/components/DropdownInput';
import SwitchComponent from '@/components/SwitchComponent';
import { useForm } from '@/hooks/useForm';
import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { SupportedCurrencies } from '@/lib/constants';
import { resetDatabase } from '@/lib/database/SettingsRepository';
import { CurrencyEnum } from '@/lib/enums/CurrencyEnum';
import { Settings } from '@/lib/types/Settings';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

const SettingsScreen: React.FC = () => {
  const { appTheme, settings, saveOrUpdateSettings } = useSettingsContext();
  const { getResource } = useLocalization();
  const [isLoading, setIsLoading] = React.useState(false);
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
    [saveOrUpdateSettings, values, handleChange],
  );

  const handleResetDatabase = React.useCallback(() => {
    setIsLoading(true);
    resetDatabase();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color={appTheme.background.accent} />
    );
  }

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
          {getResource('titleSettings')}
        </Text>
        <Text style={{ color: appTheme.text.secondary, marginTop: 12 }}>
          {getResource('labelSettingsDescription')}
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
          label={getResource('labelSourceCurrency')}
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
          label={getResource('labelTargetCurrency')}
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
          label={getResource('labelDarkMode')}
          value={values.theme === 'dark'}
          onValueChange={value =>
            handleSettingsChange('theme', value ? 'dark' : 'light')
          }
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
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'space-between',
            maxWidth: '100%',
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              color: appTheme.text.primary,
              fontSize: 16,
              textAlign: 'left',
              lineHeight: 20,
            }}
          >
            {getResource('labelResetDatabase')}
          </Text>
          <TouchableOpacity
            onPress={handleResetDatabase}
            style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                backgroundColor: appTheme.background.accent,
                color: appTheme.text.primary,
                padding: 10,
                borderRadius: 5,
                textAlign: 'center',
              }}
            >
              {getResource('labelReset')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SettingsScreen;
