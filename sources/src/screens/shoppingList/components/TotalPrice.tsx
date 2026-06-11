import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TotalPriceProps {
  totalPrice: number;
  convertedTotalPrice: number | null;
}

const TotalPrice: React.FC<TotalPriceProps> = props => {
  const { totalPrice, convertedTotalPrice } = props;
  const { appTheme, settings } = useSettingsContext();
  const { getResource } = useLocalization();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: appTheme.background.primary },
      ]}
    >
      <Text style={[styles.footerLabel, { color: appTheme.text.secondary }]}>
        {getResource('labelTotalPrice')}
      </Text>
      <View style={styles.footerAmounts}>
        <Text
          style={[
            styles.footerTotal,
            { color: appTheme.text.primary, fontWeight: 'bold' },
          ]}
        >
          {`${totalPrice.toFixed(2)} ${settings?.sourceCurrency}`}
        </Text>
        <View
          style={{
            height: 1,
            backgroundColor: appTheme.background.accent,
            width: '100%',
          }}
        />
        <Text
          style={[
            styles.footerTotal,
            { color: appTheme.text.primary, fontWeight: 'bold' },
          ]}
        >
          {`${convertedTotalPrice?.toFixed(2)} ${settings?.targetCurrency}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerLabel: {
    fontSize: 20,
    fontWeight: '500',
  },
  footerAmounts: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  footerTotal: {
    fontSize: 16,
    marginVertical: 4,
  },
});

export default TotalPrice;
