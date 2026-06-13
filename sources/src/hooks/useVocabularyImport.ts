import { importWordList } from '@/lib/database/VocabularyRepository';
import { VocabularyImport } from '@/lib/types/vocabulary/VocabularyImport';
import React from 'react';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import RNFS from 'react-native-fs';

const fileType = { type: ['application/json'] };

type UseVocabularyImportReturn = {
  pickVocabularyFile: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

export const useVocabularyImport = (): UseVocabularyImportReturn => {
  const [file, setFile] = React.useState<DocumentPickerResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const pickVocabularyFile = React.useCallback(async () => {
    try {
      setError(null);
      const picked = await DocumentPicker.pickSingle(fileType);
      setFile(picked);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        return;
      }
      setFile(null);
      setError(
        `Failed to pick vocabulary file: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`,
      );
    }
  }, []);

  const importFile = React.useCallback(async () => {
    if (!file) return;
    console.log('Importing vocabulary from file:', file.uri);

    try {
      setIsLoading(true);

      const content = await RNFS.readFile(file.uri, 'utf8');

      console.log('File content:', content);

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
  }, [file]);

  React.useEffect(() => {
    if (file) {
      importFile();
    }
  }, [file, importFile]);

  return { pickVocabularyFile, isLoading, error };
};
