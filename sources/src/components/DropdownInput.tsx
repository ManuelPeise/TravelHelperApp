import { useSettingsContext } from '@/hooks/useSettingsContext';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface DropdownInputProps {
  label: string;
  value: string | null;
  options: string[];
  onValueChange: (value: string) => void;
}

const DropdownInput: React.FC<DropdownInputProps> = props => {
  const { label, value, options, onValueChange } = props;
  const { appTheme } = useSettingsContext();
  const [open, setOpen] = useState(false);

  const handleSelect = (option: string) => {
    onValueChange(option);
    setOpen(false);
  };

  return (
    <View style={{ width: '100%' }}>
      <TouchableOpacity
        style={[
          styles.trigger,
          {
            backgroundColor: appTheme.background.secondary,
            borderColor: appTheme.border,
          },
        ]}
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.triggerLabel, { color: appTheme.text.secondary }]}>
          {label}
        </Text>
        <View style={styles.triggerRight}>
          <Text style={[styles.triggerValue, { color: appTheme.text.primary }]}>
            {value ?? ''}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color={appTheme.text.secondary}
            style={styles.chevron}
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={0}
            onPress={() => setOpen(false)}
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
              <TouchableOpacity onPress={() => setOpen(false)} hitSlop={8}>
                <Ionicons
                  name="close"
                  size={22}
                  color={appTheme.text.secondary}
                />
              </TouchableOpacity>
            </View>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              {options.map(option => {
                const isSelected = option === value;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.item,
                      isSelected && {
                        backgroundColor: appTheme.background.disabled,
                      },
                    ]}
                    disabled={isSelected}
                    onPress={() => handleSelect(option)}
                  >
                    <Text
                      style={[
                        styles.itemText,
                        { color: appTheme.text.primary },
                      ]}
                    >
                      {option}
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
    </View>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  triggerLabel: {
    fontSize: 14,
  },
  triggerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  triggerValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  chevron: {
    marginTop: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
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
    marginBottom: 12,
  },
  headerLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 15,
  },
});

export default DropdownInput;
