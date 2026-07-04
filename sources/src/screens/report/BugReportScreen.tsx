import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CurrencyConversionStackParamList } from '@/lib/types/navigation';
import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useForm } from '@/hooks/useForm';
import { useBugReporting } from '@/hooks/useBugReporting';
import TextInputField from '@/components/TextInputField';

type Props = NativeStackScreenProps<
  CurrencyConversionStackParamList,
  'ReportBug'
>;

type BugReportModel = {
  subject: string;
  description: string;
  stepsToReproduce: string;
};

const BugReportScreen: React.FC<Props> = props => {
  const { navigation } = props;
  const { appTheme } = useSettingsContext();
  const { getResource } = useLocalization();

  const { values, isModified, handleChange, resetForm } =
    useForm<BugReportModel>({
      subject: '',
      description: '',
      stepsToReproduce: '',
    });

  const { isLoading, reportBug } = useBugReporting();

  const handleReportBug = React.useCallback(async () => {
    const result = await reportBug(
      values.subject,
      values.description,
      values.stepsToReproduce,
    );
    if (!result.success) {
      Alert.alert(getResource('labelBugReport'), getResource(result.errorKey));
      return;
    }
    resetForm();
    navigation.navigate('CurrencyConversionHome');
  }, [navigation, reportBug, resetForm, values, getResource]);

  const handleCancel = React.useCallback(() => {
    resetForm();
    navigation.navigate('CurrencyConversionHome');
  }, [navigation, resetForm]);

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: appTheme.background.secondary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          { backgroundColor: appTheme.background.primary },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text
            style={[
              styles.caption,
              { color: appTheme.text.primary, marginTop: 10 },
            ]}
          >
            {getResource('captionError')}
          </Text>
          <TextInputField
            placeholder={getResource('labelErrorShortDescription')}
            value={values.subject}
            onChange={value => handleChange('subject', value)}
          />
          <Text
            style={[
              styles.caption,
              { color: appTheme.text.primary, marginTop: 10 },
            ]}
          >
            {getResource('captionStepsToReproduce')}
          </Text>
          <TextInputField
            placeholder={getResource('labelStepsToReproduce')}
            placeholderTextColor={appTheme.text.disabled}
            value={values.stepsToReproduce}
            onChange={value => handleChange('stepsToReproduce', value)}
            multiline={true}
            numberOfLines={20}
          />
          <Text
            style={[
              styles.caption,
              { color: appTheme.text.primary, marginTop: 10 },
            ]}
          >
            {getResource('captionBugDescription')}
          </Text>
          <TextInputField
            placeholder={getResource('labelEnterBugDescription')}
            placeholderTextColor={appTheme.text.disabled}
            value={values.description}
            onChange={value => handleChange('description', value)}
            multiline={true}
            numberOfLines={20}
          />
        </View>
      </ScrollView>
      <View
        style={[
          styles.buttonContainer,
          { backgroundColor: appTheme.background.primary },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: appTheme.background.accent },
          ]}
          onPress={handleCancel}
        >
          <Text>{getResource('labelCancel')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                !isModified || isLoading
                  ? appTheme.background.disabled
                  : appTheme.background.accent,
            },
          ]}
          onPress={handleReportBug}
          disabled={isLoading}
        >
          <Text>{getResource('labelSubmit')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    gap: 30,
    marginBottom: 5,
  },
  caption: {
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
});

export default BugReportScreen;
