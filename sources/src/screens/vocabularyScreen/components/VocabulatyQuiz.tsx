import { useSettingsContext } from '@/hooks/useSettingsContext';
import {
  VocabularyQuizItem,
  VocabularyQuizOptions,
} from '@/hooks/useVocabulary';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import VocabularyQuizOptionsContainer from './VocabularyQuizOptionsContainer';
import VocabularyQuestionResultModal from './VocabularyQuestionResultModal';
import VocabularyQuizResultModal from './VocabularyQuizResultModal';
import { VocabularyStackParamList } from '@/lib/types/navigation';
import { NativeStackScreenProps } from 'node_modules/@react-navigation/native-stack/lib/typescript/src/types';

interface VocabularyQuizProps {
  items: VocabularyQuizItem[];
}

type VocabularyQuizState = {
  currentQuestionIndex: number;
  score: number;
  isCorrectAnswer: boolean;
  optionsDisabled: boolean;
  showCorrectAnswer: boolean;
  showQuizResultDialog: boolean;
};

type Props = NativeStackScreenProps<VocabularyStackParamList, 'VocabularyQuiz'>;

const VocabularyQuiz: React.FC<VocabularyQuizProps & Props> = props => {
  const { items, navigation } = props;
  const { appTheme } = useSettingsContext();

  const [state, setState] = React.useState<VocabularyQuizState>({
    currentQuestionIndex: 0,
    score: 0,
    isCorrectAnswer: false,
    optionsDisabled: false,
    showCorrectAnswer: false,
    showQuizResultDialog: false,
  });

  const currentItem = React.useMemo((): VocabularyQuizItem | null => {
    return items[state.currentQuestionIndex] || null;
  }, [state.currentQuestionIndex, items]);

  const handleSelectOption = React.useCallback(
    (option: VocabularyQuizOptions) => {
      const isCorrect = option.isCorrect;

      setState(prevState => ({
        ...prevState,
        score: isCorrect ? prevState.score + 1 : prevState.score,
        optionsDisabled: true,
        showCorrectAnswer: true,
        isCorrectAnswer: isCorrect,
      }));
    },
    [],
  );

  const handleCloseResultModal = React.useCallback(() => {
    setState(prevState => {
      const nextIndex =
        items.length > prevState.currentQuestionIndex + 1
          ? prevState.currentQuestionIndex + 1
          : 0;

      return {
        ...prevState,
        currentQuestionIndex: nextIndex,
        optionsDisabled: nextIndex === 0 ? true : false,
        showCorrectAnswer: false,
        showQuizResultDialog: nextIndex === 0 ? true : false,
      };
    });
  }, [items.length]);

  const handleCloseQuizResultDialog = React.useCallback(() => {
    setState(prevState => ({
      ...prevState,
      currentQuestionIndex: 0,
      score: 0,
      isCorrectAnswer: false,
      optionsDisabled: false,
      showCorrectAnswer: false,
      showQuizResultDialog: false,
    }));

    navigation.goBack();
  }, [navigation]);

  if (currentItem === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      {!state.showQuizResultDialog && (
        <View
          style={[
            styles.cardContainer,
            {
              backgroundColor: appTheme.background.primary,
            },
          ]}
        >
          <View style={styles.cardItem}>
            <Text
              style={[styles.vocabulary, { color: appTheme.text.secondary }]}
            >
              {currentItem.word}
            </Text>

            <View
              style={[
                styles.divider,
                { backgroundColor: appTheme.background.accent },
              ]}
            />

            <Text style={[styles.phonetic, { color: appTheme.text.primary }]}>
              {currentItem.phonetic}
            </Text>
          </View>
          <View style={[styles.cardItem]}>
            <VocabularyQuizOptionsContainer
              options={currentItem.options}
              optionsDisabled={state.optionsDisabled}
              onSelectOption={handleSelectOption}
            />
          </View>
        </View>
      )}
      <VocabularyQuestionResultModal
        open={state.showCorrectAnswer}
        options={currentItem.options}
        isCorrect={state.isCorrectAnswer}
        onClose={handleCloseResultModal}
      />
      <VocabularyQuizResultModal
        visible={state.showQuizResultDialog}
        score={state.score}
        total={items.length}
        onClose={handleCloseQuizResultDialog}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  cardContainer: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  cardItem: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  language: {
    width: '100%',
    fontSize: 21,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 8,
  },
  vocabulary: {
    width: '100%',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  phonetic: {
    width: '100%',
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  divider: {
    width: '60%',
    height: StyleSheet.hairlineWidth,
    marginVertical: 16, // reduce from 16
    alignSelf: 'center',
  },
  toggleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 20,
  },
  option: {
    width: '100%',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 4,
  },
});

export default VocabularyQuiz;
