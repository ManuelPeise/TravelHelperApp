import { useLocalization } from '@/hooks/useLocalization';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IProps {
  open: boolean;
  shoppingListName: string;
  onAction: () => void | Promise<void>;
  onCancel: () => void | Promise<void>;
}

const DeleteShoppingListModal: React.FC<IProps> = props => {
  const { open, onAction, onCancel, shoppingListName } = props;

  const { getResource } = useLocalization();
  const { appTheme } = useSettingsContext();

  return (
    <Modal
      visible={open}
      onRequestClose={onCancel}
      animationType="fade"
      transparent={true}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: appTheme.card,
              borderColor: appTheme.border,
            },
          ]}
        >
          <Text style={[styles.title, { color: appTheme.text.primary }]}>
            {getResource('titleDeleteShoppingList')}
          </Text>
          <View style={styles.labelContainer}>
            <Text style={[styles.label, { color: appTheme.text.primary }]}>
              {getResource('labelDeleteShoppingList').replace(
                '{list}',
                shoppingListName,
              )}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: appTheme.background.accent },
              ]}
              onPress={onCancel}
            >
              <Text style={{ color: appTheme.text.primary }}>
                {getResource('labelCancel')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: appTheme.background.accent,
                },
              ]}
              onPress={onAction}
            >
              <Text style={{ color: appTheme.text.primary }}>
                {getResource('labelDelete')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  labelContainer: {
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  label: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
});

export default DeleteShoppingListModal;
