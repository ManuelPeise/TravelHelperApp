import React from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CurrencyConversionStackParamList } from '@/lib/types/navigation';
import { View, Text, StyleSheet } from 'react-native';
import { DEVELOPER_NAME, DEVELOPER_ADDRESS, CONTACT_EMAIL } from '@env';
type Props = NativeStackScreenProps<
  CurrencyConversionStackParamList,
  'Impressum'
>;

const ImpressumScreen: React.FC<Props> = () => {
  const { appTheme } = useSettingsContext();
  const { getResource } = useLocalization();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: appTheme.background.primary },
      ]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.impressumContainer}>
          <Text
            style={[
              styles.contentText,
              { color: appTheme.text.primary, marginBottom: 40, fontSize: 18 },
            ]}
          >
            {getResource('labelAppName')}
          </Text>
          <Text
            style={[
              styles.contentText,
              {
                color: appTheme.text.primary,
                fontSize: 18,
                fontWeight: 'bold',
                marginTop: 20,
              },
            ]}
          >
            {getResource('captionResponsible')}
          </Text>
          <Text
            style={[styles.responsibleText, { color: appTheme.text.primary }]}
          >
            {getResource('labelResponsibleName').replace(
              '{Name}',
              DEVELOPER_NAME,
            )}
          </Text>
          <Text
            style={[styles.responsibleText, { color: appTheme.text.primary }]}
          >
            {getResource('labelResponsibleAddress').replace(
              '{Address}',
              DEVELOPER_ADDRESS,
            )}
          </Text>
          <Text
            style={[
              styles.contentText,
              {
                color: appTheme.text.primary,
                fontWeight: 'bold',
                marginTop: 20,
                fontSize: 18,
              },
            ]}
          >
            {getResource('captionContact')}
          </Text>
          <Text
            style={[styles.responsibleText, { color: appTheme.text.primary }]}
          >
            {getResource('labelResponsibleEmail').replace(
              '{Email}',
              CONTACT_EMAIL,
            )}
          </Text>
          <Text
            style={[
              styles.contentText,
              {
                color: appTheme.text.primary,
                fontWeight: 'bold',
                marginTop: 20,
                fontSize: 18,
              },
            ]}
          >
            {getResource('captionUsageAndStorage')}
          </Text>
          <Text
            style={[styles.responsibleText, { color: appTheme.text.primary }]}
          >
            {getResource('labelUsageAndStorageDescription')}
          </Text>
        </View>
        <View style={styles.copyrightContainer}>
          <Text
            style={[styles.copyRightText, { color: appTheme.text.primary }]}
          >
            {getResource('labelCopyright')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  impressumContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  copyrightContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentText: {
    textAlign: 'left',
    fontSize: 16,
    marginTop: 10,
  },
  copyRightText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 5,
  },
  responsibleText: {
    fontSize: 16,
    marginTop: 5,
  },
});
export default ImpressumScreen;
