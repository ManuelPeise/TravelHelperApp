import { Translation } from './Translation';

export type VocabularyWord = {
  word: string;
  phonetic: string;
  lang: string;
  groupId?: number;
  category: string;
  translations: Translation[];
};
