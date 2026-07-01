import DropdownInput from '@/components/DropdownInput';
import { useForm } from '@/hooks/useForm';
import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { SupportedCurrencies, SupportedLanguages } from '@/lib/constants';
import { resetDatabase } from '@/lib/database/SettingsRepository';
import { CurrencyEnum } from '@/lib/enums/CurrencyEnum';
import { LanguageEnum } from '@/lib/enums/LanguageEnum';
import { Settings } from '@/lib/types/Settings';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const SettingsScreen: React.FC = () => {
  const { appTheme, settings, saveOrUpdateSettings } = useSettingsContext();
  const { getResource, changeLanguage } = useLocalization();
  const [isLoading, setIsLoading] = React.useState(false);
  const { values, handleChange } = useForm<Settings>({
    id: 1,
    sourceCurrency: (settings?.sourceCurrency as CurrencyEnum) || null,
    targetCurrency: (settings?.targetCurrency as CurrencyEnum) || null,
    language: (settings?.language as LanguageEnum) || LanguageEnum.ENGLISH,
    theme: settings?.theme || 'dark',
  });

  const handleSettingsChange = React.useCallback(
    (field: keyof Settings, value: any) => {
      handleChange(field, value);
      saveOrUpdateSettings({ ...values, [field]: value });
      if (field === 'language') {
        changeLanguage(value);
      }
    },
    [saveOrUpdateSettings, values, handleChange, changeLanguage],
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
        style={[styles.card, { backgroundColor: appTheme.background.primary }]}
      >
        <DropdownInput
          options={SupportedLanguages}
          label={getResource('labelLanguage')}
          value={values.language}
          onValueChange={value => handleSettingsChange('language', value)}
        />
      </View>
      <View
        style={[styles.card, { backgroundColor: appTheme.background.primary }]}
      >
        <DropdownInput
          options={SupportedCurrencies}
          label={getResource('labelSourceCurrency')}
          value={values.sourceCurrency}
          onValueChange={value => handleSettingsChange('sourceCurrency', value)}
        />
      </View>
      <View
        style={[styles.card, { backgroundColor: appTheme.background.primary }]}
      >
        <DropdownInput
          options={SupportedCurrencies.filter(c => c !== values.sourceCurrency)}
          label={getResource('labelTargetCurrency')}
          value={values.targetCurrency}
          onValueChange={value => handleSettingsChange('targetCurrency', value)}
        />
      </View>
      <View
        style={[styles.card, { backgroundColor: appTheme.background.primary }]}
      >
        <View style={styles.resetRow}>
          <Text style={[styles.resetLabel, { color: appTheme.text.primary }]}>
            {getResource('labelResetDatabase')}
          </Text>
          <TouchableOpacity
            onPress={handleResetDatabase}
            style={styles.resetButton}
          >
            <Text
              style={[
                styles.resetButtonText,
                {
                  backgroundColor: appTheme.background.accent,
                  color: appTheme.text.primary,
                },
              ]}
            >
              {getResource('labelReset')}
            </Text>
          </TouchableOpacity>
        </View>
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
  card: {
    width: '100%',
    padding: 10,
  },
  descriptionCard: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 38,
  },
  description: {
    marginTop: 4,
  },
  resetRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  resetLabel: {
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
  },
  resetButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
});

export default SettingsScreen;
