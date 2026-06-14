import { VocabularySettings } from '@/screens/vocabularyScreen/components/VocabularySettingsModal';

export type RootTabParamList = {
  CurrencyConversion: undefined;
  Vocabulary: undefined;
  Settings: undefined;
  ShoppingList: undefined;
};

export type ShoppingListStackParamList = {
  ShoppingListOverview: undefined;
  ShoppingListDetail: { shoppingId: number; shoppingName: string };
};

export type VocabularyStackParamList = {
  VocabularyOverview: undefined;
  VocabularyView: {
    category: string;
    vocabularySettings: VocabularySettings;
  };
  VocabularyQuiz: { category: string; vocabularySettings: VocabularySettings };
};
