import { getVocabulariesFromDb } from '@/lib/database/VocabularyRepository';
import { LanguageEnum } from '@/lib/enums/LanguageEnum';
import { VocabularyWord } from '@/lib/types/vocabulary/VocabularyWord';
import { utils } from '@/lib/utils';
import React from 'react';

type VocabularyCategory = {
  name: string;
  wordCount?: number;
};

export const useVocabulary = (
  languages?: LanguageEnum[],
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

  React.useEffect(() => {
    if (languages) {
      onLoadVocabularies(languages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const vocabularyCategories = React.useMemo((): VocabularyCategory[] => {
    try {
      setIsLoading(true);
      if (!vocabularies || vocabularies.length === 0) {
        return [];
      }

      const categoriesFiltered = utils.distictBy(
        vocabularies,
        vocab => vocab.category,
        model => model.lang === LanguageEnum.ENGLISH,
      );

      return categoriesFiltered.map(category => {
        const wordCount = vocabularies.filter(
          vocab =>
            vocab.category === category && vocab.lang === LanguageEnum.ENGLISH,
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
  }, [vocabularies]);

  return {
    isLoading,
    error,
    vocabularies,
    vocabularyCategories,
  };
};
