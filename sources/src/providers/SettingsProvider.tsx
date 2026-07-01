import { useLocalization } from '@/hooks/useLocalization';
import {
  saveOrUpdateSettings,
  getSettingsFromDb,
} from '@/lib/database/SettingsRepository';
import { CurrencyEnum } from '@/lib/enums/CurrencyEnum';
import { LanguageEnum } from '@/lib/enums/LanguageEnum';
import i18n from '@/lib/localizations/i18n';
import { Settings } from '@/lib/types/Settings';
import React, { useCallback, useState } from 'react';

export type SettingsContextType = {
  settings: Settings | null;
  saveOrUpdateSettings: (settings: Settings) => void;
};

export const SettingsContext = React.createContext<SettingsContextType>({
  settings: null,
  saveOrUpdateSettings: () => {},
});

interface IProps extends React.PropsWithChildren {}

const SettingsProvider: React.FC<IProps> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const { changeLanguage } = useLocalization();
  const saveSettings = useCallback(async (settings: Settings) => {
    await saveOrUpdateSettings(settings, true).then(() => {
      setSettings(settings);
    });
  }, []);

  React.useEffect(() => {
    const loadSettings = async () => {
      const settings = await getSettingsFromDb(1);

      if (settings) {
        setSettings(settings);
        changeLanguage(settings.language);
      } else {
        setSettings({
          id: 1,
          sourceCurrency: CurrencyEnum.EUR,
          targetCurrency: CurrencyEnum.DKK,
          language: LanguageEnum.ENGLISH,
          theme: 'dark',
        });
        changeLanguage(LanguageEnum.ENGLISH);
      }
    };
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        saveOrUpdateSettings: saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
