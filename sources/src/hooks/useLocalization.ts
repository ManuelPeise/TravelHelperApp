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
    (lng: string) => {
      i18n.changeLanguage(lng);
    },
    [i18n],
  );

  return { getResource, changeLanguage };
};
