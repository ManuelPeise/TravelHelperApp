import { useVocabulary } from '@/hooks/useVocabulary';
import { VocabularyStackParamList } from '@/lib/types/navigation';
import { NativeStackScreenProps } from 'node_modules/@react-navigation/native-stack/lib/typescript/src/types';
import React from 'react';
import { Text, View } from 'react-native';

type Props = NativeStackScreenProps<
  VocabularyStackParamList,
  'VocabularyLearning'
>;

const VocabularyLearningScreen: React.FC<Props> = props => {
  const { route, navigation } = props;

  const { category, vocabularySettings } = route.params;

  const { vocabularies } = useVocabulary(
    [vocabularySettings.sourceLanguage, vocabularySettings.targetLanguage],
    category,
  );

  console.log('sourceLanguage', vocabularySettings.sourceLanguage);
  console.log('targetLanguage', vocabularySettings.targetLanguage);
  console.log('category', category);
  console.log('vocabularies', vocabularies);

  return (
    <View>
      <Text>Vocabulary Learning Screen</Text>
    </View>
  );
};

export default VocabularyLearningScreen;
