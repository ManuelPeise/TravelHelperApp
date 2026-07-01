import { useSettingsContext } from '@/hooks/useSettingsContext';
import { PackingPerson } from '@/lib/types/packing/packingPerson';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PersonRowPackingItem from './PersonRowPackingItem';

interface IProps {
  person: PackingPerson;
  listId: number;
  name: string;
  handleUpdatePackingItemForPerson: (
    personId: number,
    itemId: number,
    listId: number,
    checked: boolean,
  ) => Promise<void>;
  handleRemovePackingItemForPerson: (
    personId: number,
    listId: number,
    itemId: number,
  ) => Promise<void>;
  handleOpenAddPackingItemModal: (personId: number) => void;
  unAssignPerson: (personId: number, listId: number) => void;
}

type PersonRowState = {
  mode: 'open' | 'closed';
};

const PersonRow: React.FC<IProps> = props => {
  const {
    person,
    listId,
    name,
    handleOpenAddPackingItemModal,
    unAssignPerson,
    handleUpdatePackingItemForPerson,
    handleRemovePackingItemForPerson,
  } = props;
  const { appTheme } = useSettingsContext();

  const [state, setState] = React.useState<PersonRowState>({ mode: 'closed' });
  const checked = React.useMemo(() => {
    return person.items.every(item => item.checked);
  }, [person.items]);

  return (
    <View
      style={[
        styles.rowContainer,
        { borderBottomColor: appTheme.background.accent },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.checkboxColumn}>
          <TouchableOpacity onPress={() => unAssignPerson(person.id, listId)}>
            <Ionicons
              style={{ color: appTheme.text.primary }}
              name={'trash-outline'}
              size={22}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.personNameColumn}>
          <Text
            style={[styles.rowColumnText, { color: appTheme.text.primary }]}
          >
            {name}
          </Text>
        </View>
        <View style={styles.iconColumn}>
          <Ionicons
            style={{ color: checked ? appTheme.success : appTheme.error }}
            name={checked ? 'checkmark-outline' : 'alert-outline'}
            size={22}
          />
        </View>
        <View style={styles.iconColumn}>
          <TouchableOpacity
            onPress={() => handleOpenAddPackingItemModal(person.id)}
          >
            <Ionicons
              style={{ color: appTheme.text.primary }}
              name={'add-circle-outline'}
              size={22}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.iconColumn}>
          <TouchableOpacity
            disabled={person.items.length === 0}
            onPress={() =>
              setState(prev => ({
                ...prev,
                mode: prev.mode === 'open' ? 'closed' : 'open',
              }))
            }
          >
            <Ionicons
              style={{
                color:
                  person.items.length === 0
                    ? appTheme.text.disabled
                    : appTheme.text.primary,
              }}
              name={
                state.mode === 'closed'
                  ? 'chevron-down-outline'
                  : 'chevron-up-outline'
              }
              size={22}
            />
          </TouchableOpacity>
        </View>
      </View>
      {state.mode === 'open' &&
        person.items.map(item => (
          <PersonRowPackingItem
            key={item.id}
            personId={person.id}
            listId={listId}
            item={item}
            removeItem={handleRemovePackingItemForPerson}
            updateItem={handleUpdatePackingItemForPerson}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  row: {
    width: '100%',
    paddingVertical: 4,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  checkboxColumn: {
    width: 'auto',
    alignItems: 'flex-start',
  },
  personNameColumn: {
    width: '55%',
    alignItems: 'flex-start',
  },
  iconColumn: {
    width: 'auto',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
  },
  rowColumnText: {
    fontSize: 16,
  },
});

export default PersonRow;
