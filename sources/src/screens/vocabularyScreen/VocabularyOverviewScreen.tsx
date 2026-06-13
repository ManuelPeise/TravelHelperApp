import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { useVocabulary } from '@/hooks/useVocabulary';
import { useVocabularyImport } from '@/hooks/useVocabularyImport';
import { LanguageEnum } from '@/lib/enums/LanguageEnum';
import { VocabularyStackParamList } from '@/lib/types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import VocabularySettingsModal, {
  VocabularySettings,
} from './components/VocabularySettingsModal';
import { StorageKeyEnum, useStorage } from '@/hooks/useStorage';

type Props = NativeStackScreenProps<
  VocabularyStackParamList,
  'VocabularyOverview'
>;

type VocabularyOverviewScreenModel = {
  open: boolean;
  settings: VocabularySettings;
};

const VocabularyOverviewScreen: React.FC<Props> = props => {
  const { navigation } = props;
  const { appTheme } = useSettingsContext();

  const { storageModel, setItem } = useStorage<VocabularySettings>(
    StorageKeyEnum.VocabularySettings,
    {
      sourceLanguage: LanguageEnum.GERMAN,
      targetLanguage: LanguageEnum.ENGLISH,
    },
  );

  const { getResource } = useLocalization();

  const [model, setModel] = React.useState<VocabularyOverviewScreenModel>({
    open: false,
    settings: storageModel,
  });

  const vocabularyImport = useVocabularyImport();

  const vocabulary = useVocabulary([
    model.settings.sourceLanguage,
    model.settings.targetLanguage,
  ]);

  const settingsButtonDisabled = React.useMemo(() => {
    return (
      vocabulary.isLoading ||
      vocabularyImport.isLoading ||
      vocabulary.vocabularyCategories.length === 0
    );
  }, [vocabulary, vocabularyImport]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRowContent}>
          <TouchableOpacity
            onPress={() => setModel(prev => ({ ...prev, open: true }))}
            style={styles.headerButton}
            disabled={settingsButtonDisabled}
          >
            <Ionicons
              name="cog-outline"
              size={26}
              color={
                settingsButtonDisabled
                  ? appTheme.text.disabled
                  : appTheme.text.primary
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={vocabularyImport.pickVocabularyFile}
            style={styles.headerButton}
          >
            <Ionicons
              name="add-outline"
              size={26}
              color={appTheme.text.primary}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, vocabularyImport, appTheme, settingsButtonDisabled]);

  const getWordCountText = React.useCallback(
    (count: number): string => {
      return getResource('labelWords').replace('{count}', String(count));
    },
    [getResource],
  );

  if (vocabulary.isLoading || vocabularyImport.isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={appTheme.background.accent}
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: appTheme.background.primary },
      ]}
    >
      <FlatList
        data={vocabulary.vocabularyCategories}
        keyExtractor={item => String(item.name)}
        contentContainerStyle={
          vocabulary.vocabularyCategories.length === 0 && styles.emptyContainer
        }
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: appTheme.text.disabled }]}>
            {getResource('labelNoVocabularyCategories')}
          </Text>
        }
        ItemSeparatorComponent={() => (
          <View
            style={[styles.separator, { backgroundColor: appTheme.border }]}
          />
        )}
        renderItem={({ item }) => (
          <View style={[styles.row, { backgroundColor: appTheme.card }]}>
            <View style={styles.rowContent}>
              <Text style={[styles.rowName, { color: appTheme.text.primary }]}>
                {item.name}
              </Text>
              <Text
                style={[styles.rowDate, { color: appTheme.text.secondary }]}
              >
                {getWordCountText(item.wordCount ?? 0)}
              </Text>
            </View>
            <View style={styles.rowActions}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('VocabularyLearning', {
                    category: item.name,
                    vocabularySettings: model.settings,
                  });
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="reader-outline"
                  size={20}
                  color={appTheme.text.secondary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('VocabularyQuiz', {
                    category: item.name,
                    vocabularySettings: model.settings,
                  });
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="school-outline"
                  size={20}
                  color={appTheme.text.secondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <VocabularySettingsModal
        open={model.open}
        settings={model.settings}
        onCancel={() => setModel(prev => ({ ...prev, open: false }))}
        onConfirm={newSettings => {
          setItem(newSettings);
          setModel(prev => ({ ...prev, open: false, settings: newSettings }));
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    paddingHorizontal: 8,
  },
  headerRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginLeft: 12,
  },
  rowContent: {
    flex: 1,
  },
  rowName: {
    fontSize: 16,
    fontWeight: '500',
  },
  rowDate: {
    fontSize: 13,
    marginTop: 2,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default VocabularyOverviewScreen;
