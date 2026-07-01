import { LanguageEnum } from '@/lib/enums/LanguageEnum';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const useLocalization = () => {
  const { t, i18n } = useTranslation();

  const getResource = React.useCallback(
    (key: string) => {
      return t(key);
    },
    [t],
  );

  const changeLanguage = React.useCallback(
    (lng: LanguageEnum) => {
      console.log(lng);
      i18n.changeLanguage(lng.toLocaleLowerCase());
    },
    [i18n],
  );

  return { getResource, changeLanguage };
};
