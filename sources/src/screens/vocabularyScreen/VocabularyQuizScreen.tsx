import { VocabularyStackParamList } from '@/lib/types/navigation';
import { NativeStackScreenProps } from 'node_modules/@react-navigation/native-stack/lib/typescript/src/types';
import React from 'react';
import { Text, View } from 'react-native';

type Props = NativeStackScreenProps<VocabularyStackParamList, 'VocabularyQuiz'>;

const VocabularyQuizScreen: React.FC<Props> = props => {
  const { route, navigation } = props;

  const { category, vocabularySettings } = route.params;

  console.log('category', category);
  console.log('vocabularySettings', vocabularySettings);

  return (
    <View>
      <Text>Vocabulary Quiz Screen</Text>
    </View>
  );
};

export default VocabularyQuizScreen;
