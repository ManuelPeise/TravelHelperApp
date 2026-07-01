import { DbPackingList } from '../types/packing/db/DbPackingList';
import { DbPackingPerson } from '../types/packing/db/DbPackingPerson';
import { PackingItem } from '../types/packing/packingItem';
import { PackingList } from '../types/packing/packingList';
import { PackingPerson } from '../types/packing/packingPerson';
import { getDatabase } from './SqliteDb';

interface SqlRows {
  length: number;
  item(i: number): any;
}

const mapRows = <T>(rows: SqlRows): T[] => {
  const result: T[] = [];
  for (let i = 0; i < rows.length; i++) {
    result.push(rows.item(i));
  }
  return result;
};

// packing lists

const getPersonsForPackingList = async (
  listId: number,
): Promise<PackingPerson[]> => {
  const db = await getDatabase();

  const [result] = await db.executeSql(
    'SELECT * FROM packing_people WHERE id IN (SELECT personId FROM packing_list_person WHERE listId = ?)',
    [listId],
  );

  const persons = mapRows<PackingPerson>(result.rows);

  await Promise.all(
    persons.map(async person => {
      const [itemRes] = await db.executeSql(
        `SELECT pi.*, ppi.count, ppi.checked FROM packing_items pi
        JOIN packing_personal_items ppi ON pi.id = ppi.itemId
        WHERE ppi.personId = ? AND ppi.listId = ?`,
        [person.id, listId],
      );

      const items = mapRows<PackingItem>(itemRes.rows);

      person.items = items;
    }),
  );

  return persons;
};

export const getPackingLists = async (): Promise<PackingList[]> => {
  try {
    const db = await getDatabase();

    const [listRes] = await db.executeSql('SELECT * FROM packing_lists ', []);

    const dbPackingLists = mapRows<DbPackingList>(listRes.rows);

    const packingList = dbPackingLists.map(async list => {
      const persons = await getPersonsForPackingList(list.id);

      return {
        id: list.id,
        title: list.title,
        subTitle: list.subTitle ?? '',
        dateCreated: list.dateCreated,
        persons: persons,
      };
    });

    return Promise.all(packingList);
  } catch (error) {
    console.error('Error fetching packing lists:', error);
    return [];
  }
};

export const getPackingListById = async (
  listId: number,
): Promise<PackingList | null> => {
  try {
    const db = await getDatabase();

    const [listRes] = await db.executeSql(
      'SELECT * FROM packing_lists WHERE id = ?',
      [listId],
    );

    if (listRes.rows.length === 0) {
      return null;
    }

    const listItem = listRes.rows.item(0);

    const returnResult = {
      id: listItem.id,
      title: listItem.title,
      subTitle: listItem.subTitle,
      dateCreated: listItem.dateCreated,
      persons: await getPersonsForPackingList(listItem.id),
    };

    return returnResult;
  } catch (error) {
    console.error('Error fetching packing list by ID:', error);
    return null;
  }
};

export const createPackingList = async (
  title: string,
  subTitle: string,
): Promise<boolean> => {
  try {
    const db = await getDatabase();
    const dateCreated = new Date().toISOString();

    await db.executeSql(
      'INSERT INTO packing_lists (title, subTitle, dateCreated) VALUES (?, ?, ?)',
      [title, subTitle, dateCreated],
    );

    return true;
  } catch (error) {
    console.error('Error creating packing list:', error);
    return false;
  }
};

export const deletePackingList = async (listId: number): Promise<boolean> => {
  try {
    const existing = await getPackingListById(listId);

    if (!existing) {
      return false;
    }

    const db = await getDatabase();

    await db.transaction(tx => {
      tx.executeSql('DELETE FROM packing_list_person WHERE listId = ?', [
        listId,
      ]);
      tx.executeSql('DELETE FROM packing_personal_items WHERE listId = ?', [
        listId,
      ]);
      tx.executeSql('DELETE FROM packing_lists WHERE id = ?', [listId]);
    });

    return true;
  } catch (error) {
    console.error('Error deleting packing list:', error);
    return false;
  }
};

// persons

export const getPackingListPeople = async (
  listId: number,
): Promise<DbPackingPerson[]> => {
  const db = await getDatabase();

  const [result] = await db.executeSql(
    'SELECT * FROM packing_people WHERE id IN (SELECT personId FROM packing_list_person WHERE listId = ?)',
    [listId],
  );

  return mapRows<DbPackingPerson>(result.rows);
};

export const getPersonsFromDb = async (): Promise<PackingPerson[]> => {
  const db = await getDatabase();

  const [result] = await db.executeSql('SELECT * FROM packing_people', []);

  return mapRows<{ id: number; name: string }>(result.rows).map(row => ({
    ...row,
    items: [],
  }));
};

export const assignPersonToList = async (
  personId: number,
  listId: number,
): Promise<void> => {
  const db = await getDatabase();

  await db.executeSql(
    'INSERT INTO packing_list_person (personId, listId) VALUES (?, ?)',
    [personId, listId],
  );
};

export const createPerson = async (
  packingListId: number,
  name: string,
): Promise<string> => {
  try {
    const db = await getDatabase();

    const [existingPerson] = await db.executeSql(
      'SELECT * FROM packing_people WHERE name = ?',
      [name],
    );

    if (existingPerson.rows.length > 0) {
      const personId = existingPerson.rows.item(0).id as number;
      await assignPersonToList(personId, packingListId);
      return personId.toString();
    }

    const [res] = await db.executeSql(
      'INSERT INTO packing_people (name) VALUES (?)',
      [name],
    );

    if (!res.insertId) {
      throw new Error('Failed to insert person — no insertId returned');
    }

    await assignPersonToList(res.insertId, packingListId);
    return res.insertId.toString();
  } catch (error) {
    console.error('Error creating person:', error);
    throw error;
  }
};

export const unAssignPersonFromList = async (
  personId: number,
  listId: number,
): Promise<void> => {
  const db = await getDatabase();

  await db.executeSql(
    'DELETE FROM packing_list_person WHERE personId = ? AND listId = ?',
    [personId, listId],
  );
};

export const getPackingItems = async (): Promise<PackingItem[]> => {
  const db = await getDatabase();

  const [result] = await db.executeSql('SELECT * FROM packing_items', []);

  return mapRows<PackingItem>(result.rows);
};

export const addPackingItemToDb = async (name: string): Promise<number> => {
  const db = await getDatabase();

  const [result] = await db.executeSql(
    'INSERT INTO packing_items (name) VALUES (?)',
    [name],
  );

  return result.insertId;
};

export const addPackingItemToPerson = async (
  personId: number,
  listId: number,
  itemId: number,
  count: number,
  checked: boolean = false,
): Promise<void> => {
  const db = await getDatabase();

  await db.executeSql(
    'INSERT INTO packing_personal_items (listId, personId, itemId, count, checked) VALUES (?, ?, ?, ?, ?)',
    [listId, personId, itemId, count, checked],
  );
};

export const removePackingItemFromPerson = async (
  personId: number,
  listId: number,
  itemId: number,
): Promise<void> => {
  const db = await getDatabase();

  await db.executeSql(
    'DELETE FROM packing_personal_items WHERE personId = ? AND listId = ? AND itemId = ?',
    [personId, listId, itemId],
  );
};

export const updatePackingItemForPerson = async (
  itemId: number,
  personId: number,
  listId: number,
  checked: boolean,
): Promise<void> => {
  const db = await getDatabase();

  await db.executeSql(
    'UPDATE packing_personal_items SET checked = ? WHERE personId = ? AND listId = ? AND itemId = ?',
    [checked ? 1 : 0, personId, listId, itemId],
  );
};
