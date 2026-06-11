import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import common_de from './translations/de/common_de.json';
import common_en from './translations/en/common_en.json';

const resources = {
  de: {
    translation: common_de,
  },
  en: {
    translation: common_en,
  },
};

const language = RNLocalize.getLocales()[0]?.languageCode || 'de';

i18n.use(initReactI18next).init({
  resources,
  lng: language,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
