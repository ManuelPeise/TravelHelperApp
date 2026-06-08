import { useSettingsContext } from '@/hooks/useSettingsContext';
import { CurrencyEnum } from '@/lib/enums/CurrencyEnum';
import { SelectableItemModel } from '@/lib/types/SelectableItemModel';
import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface ICurrencySelectorProps {
  open: boolean;
  label: string;
  items: SelectableItemModel[];
  value: CurrencyEnum;
}

interface IProps extends ICurrencySelectorProps {
  onChange: (value: CurrencyEnum) => void | Promise<void>;
  onClose?: () => void;
}

const CurrencySelector: React.FC<IProps> = props => {
  const { open, label, items, value, onChange, onClose } = props;
  const { appTheme } = useSettingsContext();

  return (
    <Modal
      visible={open}
      backdropColor="rgba(0,0,0,0.5)"
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={0}
          onPress={onClose}
        />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: appTheme.background.primary,
              borderColor: appTheme.background.accent,
              borderWidth: 1.5,
            },
          ]}
        >
          <View style={styles.header}>
            <Text
              style={[styles.headerLabel, { color: appTheme.text.secondary }]}
            >
              {label}
            </Text>
            {onClose && (
              <TouchableOpacity onPress={onClose} hitSlop={8}>
                <Ionicons
                  name="close"
                  size={22}
                  color={appTheme.text.secondary}
                />
              </TouchableOpacity>
            )}
          </View>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            {items.map(item => {
              const isSelected = item.value === value;
              return (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.item,
                    isSelected && {
                      backgroundColor: appTheme.background.disabled,
                    },
                  ]}
                  disabled={isSelected}
                  onPress={() => onChange(item.value as CurrencyEnum)}
                >
                  <Text
                    style={[
                      styles.itemText,
                      {
                        color: isSelected
                          ? appTheme.text.primary
                          : appTheme.text.primary,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={appTheme.text.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  itemText: {
    fontSize: 15,
  },
});

export default CurrencySelector;
