import CheckBoxInput from '@/components/CheckBoxInput';
import { useSettingsContext } from '@/hooks/useSettingsContext';
import { PackingItem } from '@/lib/types/packing/packingItem';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface IProps {
  personId: number;
  listId: number;
  item: PackingItem;
  updateItem: (
    personId: number,
    itemId: number,
    listId: number,
    checked: boolean,
  ) => Promise<void>;
  removeItem: (
    personId: number,
    listId: number,
    itemId: number,
  ) => Promise<void>;
}

const PersonRowPackingItem: React.FC<IProps> = props => {
  const { item, removeItem, updateItem, personId, listId } = props;
  const { appTheme } = useSettingsContext();

  return (
    <View
      style={[
        styles.rowContainer,
        { borderBottomColor: appTheme.background.accent },
      ]}
    >
      <View
        style={[styles.row, { borderBottomColor: appTheme.background.accent }]}
      >
        <View style={styles.rowColumn}>
          <View style={styles.checkboxColumn}>
            <CheckBoxInput
              checked={item.checked}
              onChange={async () => {
                await updateItem(personId, item.id, listId, !item.checked);
              }}
            />
          </View>
          <View style={styles.personNameColumn}>
            <Text
              style={[styles.rowColumnText, { color: appTheme.text.primary }]}
            >
              {`${item.count}\t\t x\t\t ${item.name}`}
            </Text>
          </View>
        </View>
        <View style={styles.rowColumn}>
          <View style={styles.iconColumn}>
            <TouchableOpacity
              onPress={async () => {
                await removeItem(personId, listId, item.id);
              }}
            >
              <Ionicons
                name={'trash-outline'}
                size={22}
                color={appTheme.text.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    marginTop: 5,
    flexDirection: 'row',
  },
  row: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1,
  },
  checkboxColumn: {
    width: 50,
    alignItems: 'flex-start',
    paddingRight: 20,
  },
  personNameColumn: {
    width: 'auto',
    alignItems: 'flex-start',
  },
  iconColumn: {
    width: 50,
    alignItems: 'flex-end',
    paddingHorizontal: 4,
  },
  rowColumnText: {
    fontSize: 16,
  },
});

export default PersonRowPackingItem;
