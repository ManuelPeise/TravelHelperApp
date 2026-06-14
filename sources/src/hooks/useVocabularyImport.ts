import { importWordList } from '@/lib/database/VocabularyRepository';
import { VocabularyImport } from '@/lib/types/vocabulary/VocabularyImport';
import React from 'react';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

const fileType = { type: ['application/json'] };

type UseVocabularyImportReturn = {
  importFile: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

export const useVocabularyImport = (): UseVocabularyImportReturn => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const importFile = React.useCallback(async () => {
    const picked = await DocumentPicker.pickSingle(fileType);
    if (!picked) return;

    try {
      setIsLoading(true);

      const content = await RNFS.readFile(picked.uri, 'utf8');

      if (content) {
        const importData: VocabularyImport = JSON.parse(content);

        if (
          !importData ||
          !Array.isArray(importData.wordList) ||
          importData.wordList.length === 0
        ) {
          setError('Invalid vocabulary file: missing or empty wordList');
          return;
        }

        await importWordList(importData.wordList);

        console.log('Vocabulary imported successfully');
      }
    } catch (err) {
      setError(
        `Failed to import vocabulary: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`,
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { importFile, isLoading, error };
};
