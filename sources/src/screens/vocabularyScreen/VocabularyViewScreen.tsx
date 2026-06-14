import { useSettingsContext } from '@/hooks/useSettingsContext';
import { useVocabulary } from '@/hooks/useVocabulary';
import { VocabularyStackParamList } from '@/lib/types/navigation';
import { NativeStackScreenProps } from 'node_modules/@react-navigation/native-stack/lib/typescript/src/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import VocabularyView from './components/VocabularyView';

type Props = NativeStackScreenProps<VocabularyStackParamList, 'VocabularyView'>;

const VocabularyViewScreen: React.FC<Props> = props => {
  const { route } = props;
  const { appTheme } = useSettingsContext();
  const { category, vocabularySettings } = route.params;

  const { vocabularyViewItems } = useVocabulary(
    vocabularySettings.sourceLanguage,
    vocabularySettings.targetLanguage,
    category,
  );

  console.log('vocabularyViewItems', vocabularyViewItems);
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: appTheme.background.primary },
      ]}
    >
      <VocabularyView items={vocabularyViewItems} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});

export default VocabularyViewScreen;
