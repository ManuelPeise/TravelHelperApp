import { VocabularyStackParamList } from '@/lib/types/navigation';
import { NativeStackScreenProps } from 'node_modules/@react-navigation/native-stack/lib/typescript/src/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import VocabularyQuiz from './components/VocabulatyQuiz';
import { useVocabulary } from '@/hooks/useVocabulary';
import { useSettingsContext } from '@/hooks/useSettingsContext';

type Props = NativeStackScreenProps<VocabularyStackParamList, 'VocabularyQuiz'>;

const VocabularyQuizScreen: React.FC<Props> = props => {
  const { route, navigation } = props;
  const { appTheme } = useSettingsContext();
  const { category, vocabularySettings } = route.params;

  const { vocabularyQuizItems } = useVocabulary(
    vocabularySettings.sourceLanguage,
    vocabularySettings.targetLanguage,
    category,
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: appTheme.background.primary },
      ]}
    >
      <Text style={[styles.title, { color: appTheme.text.primary }]}>
        {`Quiz - ${category}`}
      </Text>
      <VocabularyQuiz
        items={vocabularyQuizItems}
        route={route}
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 5,
  },
});
export default VocabularyQuizScreen;
