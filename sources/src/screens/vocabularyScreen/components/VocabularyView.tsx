import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { VocabularyViewItem } from '@/hooks/useVocabulary';
import { utils } from '@/lib/utils';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface IProps {
  items: VocabularyViewItem[];
}

type CardState = {
  index: number;
  flipped: boolean;
};

const VocabularyView: React.FC<IProps> = ({ items }) => {
  const { appTheme } = useSettingsContext();
  const { getResource } = useLocalization();

  const [cardState, setCardState] = React.useState<CardState>({
    index: 0,
    flipped: false,
  });

  const hasItems = items.length > 0;
  const currentItem = hasItems ? items[cardState.index] : null;

  const isFirst = cardState.index === 0;
  const isLast = cardState.index === items.length - 1;

  const handleNext = React.useCallback(() => {
    if (!hasItems || isLast) return;

    setCardState(prev => ({
      index: prev.index + 1,
      flipped: false,
    }));
  }, [hasItems, isLast]);

  const handlePrevious = React.useCallback(() => {
    if (!hasItems || isFirst) return;

    setCardState(prev => ({
      index: prev.index - 1,
      flipped: false,
    }));
  }, [hasItems, isFirst]);

  const onFlip = React.useCallback(() => {
    if (!hasItems) return;

    setCardState(prev => ({
      ...prev,
      flipped: !prev.flipped,
    }));
  }, [hasItems]);

  if (!currentItem) return null;

  const languageLabel = cardState.flipped
    ? utils.mapLanguageEnumToString(currentItem.targetLanguage, getResource) ??
      ''
    : utils.mapLanguageEnumToString(currentItem.sourceLanguage, getResource) ??
      '';

  const mainText = cardState.flipped
    ? currentItem.translation
    : currentItem.word;
  const phonetic = cardState.flipped
    ? currentItem.targetPhonetic
    : currentItem.sourcePhonetic;

  return (
    <View style={styles.viewContainer}>
      <TouchableOpacity
        style={[
          styles.cardContainer,
          {
            backgroundColor: cardState.flipped
              ? appTheme.background.secondary
              : appTheme.background.primary,
          },
        ]}
        onPress={onFlip}
        activeOpacity={0.9}
      >
        <Text style={[styles.language, { color: appTheme.background.accent }]}>
          {languageLabel}
        </Text>
        <View style={styles.cardItem}>
          <Text style={[styles.vocabulary, { color: appTheme.text.primary }]}>
            {mainText}
          </Text>

          <View
            style={[
              styles.divider,
              { backgroundColor: appTheme.background.accent },
            ]}
          />

          <Text style={[styles.phonetic, { color: appTheme.text.primary }]}>
            {phonetic}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={handlePrevious}
          disabled={!hasItems || isFirst}
        >
          <Ionicons
            name="chevron-back-circle-outline"
            size={50}
            color={
              !hasItems || isFirst
                ? appTheme.text.disabled
                : appTheme.text.primary
            }
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} disabled={!hasItems || isLast}>
          <Ionicons
            name="chevron-forward-circle-outline"
            size={50}
            color={
              !hasItems || isLast
                ? appTheme.text.disabled
                : appTheme.text.primary
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  cardContainer: {
    width: '100%',
    padding: 16,
    aspectRatio: 1,
    borderRadius: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
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
});

export default VocabularyView;
