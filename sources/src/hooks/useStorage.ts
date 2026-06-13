import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export enum StorageKeyEnum {
  VocabularySettings = 'vocabulary-settings',
}

export const useStorage = <TModel>(key: StorageKeyEnum, fallback: TModel) => {
  const [model, setModel] = React.useState<TModel>(fallback);
  const [error, setError] = React.useState<Error | null>(null);

  const onLoad = React.useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue != null) {
        setModel(JSON.parse(jsonValue));
      } else {
        setModel(fallback);
      }
    } catch (e) {
      setError(e as Error);
    }
  }, [key, fallback]);

  const setItem = React.useCallback(
    async (value: TModel) => {
      try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
        setModel(value);
      } catch (e) {
        setError(e as Error);
      }
    },
    [key],
  );

  React.useEffect(() => {
    const loadData = async () => {
      await onLoad();
    };
    loadData();
  }, [key]);

  return {
    storageModel: model,
    setItem,
    error,
  };
};
