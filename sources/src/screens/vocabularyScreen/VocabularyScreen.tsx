import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { VocabularyStackParamList } from '@/lib/types/navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import VocabularyOverviewScreen from './VocabularyOverviewScreen';
import VocabularyQuizScreen from './VocabularyQuizScreen';
import VocabularyLearningScreen from './VocabularyLearningScreen';

const Stack = createNativeStackNavigator<VocabularyStackParamList>();

const VocabularyHeader: React.FC<NativeStackHeaderProps> = ({
  options,
  navigation,
  back,
}) => {
  const { appTheme } = useSettingsContext();

  return (
    <View
      style={[
        headerStyles.container,
        { backgroundColor: appTheme.background.primary },
      ]}
    >
      {back && (
        <TouchableOpacity onPress={navigation.goBack} style={headerStyles.back}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={appTheme.text.primary}
          />
        </TouchableOpacity>
      )}
      <Text
        style={[headerStyles.title, { color: appTheme.text.primary }]}
        numberOfLines={1}
      >
        {options.title ?? ''}
      </Text>
      {options.headerRight && (
        <View style={headerStyles.right}>
          {options.headerRight({ tintColor: appTheme.text.primary })}
        </View>
      )}
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  back: {
    marginRight: 8,
  },
  title: {
    marginLeft: 20,
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
  },
  right: {
    marginLeft: 8,
  },
});

const VocabularyScreen: React.FC = () => {
  const { getResource } = useLocalization();
  const { appTheme } = useSettingsContext();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: appTheme.text.primary,
        contentStyle: { backgroundColor: appTheme.background.primary },
        header: props => <VocabularyHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="VocabularyOverview"
        component={VocabularyOverviewScreen}
        options={{
          title: getResource('titleAvailableVocabularyCategories'),
        }}
      />
      <Stack.Screen
        name="VocabularyLearning"
        component={VocabularyLearningScreen}
        options={({ route }) => ({
          title: getResource('titleVocabularyLearning').replace(
            '{category}',
            route.params.category,
          ),
        })}
      />
      <Stack.Screen
        name="VocabularyQuiz"
        component={VocabularyQuizScreen}
        options={({ route }) => ({
          title: getResource('titleVocabularyQuiz').replace(
            '{category}',
            route.params.category,
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default VocabularyScreen;
