import { LanguageEnum } from './enums/LanguageEnum';

export const utils = {
  distictBy: <TModel, TResult>(
    array: TModel[],
    keyFn: (item: TModel) => TResult,
    filterCallback?: (item: TModel) => boolean,
  ): TResult[] => {
    const result: TResult[] = [];
    const seenKeys = new Set<TResult>();

    for (const item of array) {
      if (filterCallback && !filterCallback(item)) {
        continue;
      }

      const key = keyFn(item);
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        result.push(key);
      }
    }
    return result;
  },
  formatDate: (iso: string): string => {
    const d = new Date(iso);
    return d.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },
  mapLanguageEnumToString: (
    language: LanguageEnum,
    callback?: (resource: string) => string,
  ): string => {
    switch (language) {
      case LanguageEnum.GERMAN:
        return callback ? callback('labelLanguageGerman') : 'de';
      case LanguageEnum.ENGLISH:
        return callback ? callback('labelLanguageEnglish') : 'en';
      case LanguageEnum.DANISH:
        return callback ? callback('labelLanguageDanish') : 'da';
      default:
        return '';
    }
  },
  mapStringToLanguageEnum: (value: string): LanguageEnum | undefined => {
    switch (value) {
      case 'Deutsch':
        return LanguageEnum.GERMAN;
      case 'Englisch':
        return LanguageEnum.ENGLISH;
      case 'Dänisch':
        return LanguageEnum.DANISH;
      case 'Getrman':
        return LanguageEnum.GERMAN;
      case 'English':
        return LanguageEnum.ENGLISH;
      case 'Danish':
        return LanguageEnum.DANISH;
      default:
        return undefined;
    }
  },
};
