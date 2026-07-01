import AppHeader from '@/components/AppHeader';
import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { VocabularyStackParamList } from '@/lib/types/navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VocabularyOverviewScreen from './VocabularyOverviewScreen';
import VocabularyQuizScreen from './VocabularyQuizScreen';
import VocabularyViewScreen from './VocabularyViewScreen';

const Stack = createNativeStackNavigator<VocabularyStackParamList>();

const VocabularyScreen: React.FC = () => {
  const { getResource } = useLocalization();
  const { appTheme } = useSettingsContext();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: appTheme.text.primary,
        contentStyle: { backgroundColor: appTheme.background.primary },
        header: props => <AppHeader {...props} />,
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
        name="VocabularyView"
        component={VocabularyViewScreen}
        options={({ route }) => ({
          title: getResource('titleViewVocabulary').replace(
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
