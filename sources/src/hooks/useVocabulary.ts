import { getVocabulariesFromDb } from '@/lib/database/VocabularyRepository';
import { LanguageEnum } from '@/lib/enums/LanguageEnum';
import { VocabularyWord } from '@/lib/types/vocabulary/VocabularyWord';
import { utils } from '@/lib/utils';
import React from 'react';

type VocabularyWordItem = {
  groupId: number;
  word: string;
  phonetic: string;
  category: string;
  lang: LanguageEnum;
};

type VocabularyCategory = {
  name: string;
  wordCount?: number;
};

export type VocabularyViewItem = {
  word: string;
  sourcePhonetic?: string;
  sourceLanguage: LanguageEnum;
  category: string;
  translation: string;
  targetPhonetic?: string;
  targetLanguage: LanguageEnum;
};

export const useVocabulary = (
  sourceLanguage: LanguageEnum,
  targetLanguage: LanguageEnum,
  category?: string,
) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [vocabularies, setVocabularies] = React.useState<
    VocabularyWord[] | null
  >(null);

  const onLoadVocabularies = React.useCallback(
    async (languages: LanguageEnum[]) => {
      let vocabularies = await getVocabulariesFromDb(languages);

      if (category) {
        vocabularies = vocabularies.filter(
          vocab => vocab.category === category,
        );
      }

      vocabularies.forEach(vocab => console.log('vocab', vocab.category));
      setVocabularies(vocabularies);
    },
    [category],
  );

  const vocabularyCategories = React.useMemo((): VocabularyCategory[] => {
    try {
      setIsLoading(true);
      if (!vocabularies || vocabularies.length === 0) {
        return [];
      }

      const categoriesFiltered = utils.distictBy(
        vocabularies,
        vocab => vocab.category,
        model => model.lang === sourceLanguage,
      );

      return categoriesFiltered.map(category => {
        const wordCount = vocabularies.filter(
          vocab => vocab.category === category && vocab.lang === sourceLanguage,
        ).length;
        return {
          name: category,
          wordCount,
        };
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [vocabularies, sourceLanguage]);

  const vocabularyViewItems = React.useMemo((): VocabularyViewItem[] => {
    if (!vocabularies) {
      return [];
    }

    const wordList: VocabularyWordItem[] = [];

    vocabularies.forEach(vocab => {
      wordList.push({
        groupId: vocab.groupId ?? 0,
        word: vocab.word,
        phonetic: vocab.phonetic,
        category: vocab.category,
        lang: vocab.lang as LanguageEnum,
      });

      vocab.translations.forEach(translation => {
        wordList.push({
          groupId: vocab.groupId ?? 0,
          word: translation.word,
          phonetic: translation.phonetic,
          category: vocab.category,
          lang: translation.lang as LanguageEnum,
        });
      });
    });

    const selectedWords = wordList.filter(w => w.lang === sourceLanguage);

    console.log('selectedWords', selectedWords);
    const mappedViewItems: VocabularyViewItem[] = [];

    selectedWords.forEach(word => {
      const translation = wordList.find(
        w => w.groupId === word.groupId && w.lang === targetLanguage,
      );

      const viewItem: VocabularyViewItem | null =
        word.lang === sourceLanguage && translation
          ? {
              word: word.word,
              sourceLanguage: word.lang,
              category: word.category,
              translation: translation.word,
              targetLanguage: translation.lang,
              sourcePhonetic: word.phonetic,
              targetPhonetic: translation.phonetic,
            }
          : null;

      if (viewItem) {
        mappedViewItems.push(viewItem);
      }
    });

    return mappedViewItems;
  }, [vocabularies, sourceLanguage, targetLanguage]);

  React.useEffect(() => {
    if (sourceLanguage && targetLanguage) {
      onLoadVocabularies([sourceLanguage, targetLanguage]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceLanguage, targetLanguage]);

  return {
    isLoading,
    error,
    vocabularies,
    vocabularyCategories,
    vocabularyViewItems,
    onLoadVocabularies,
  };
};
