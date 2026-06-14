import { getDatabase } from './SqliteDb';
import { VocabularyWord } from '../types/vocabulary/VocabularyWord';
import { LanguageEnum } from '../enums/LanguageEnum';
import { VocabularyTranslation } from '../types/vocabulary/VocabularyTranslation';

const importWordList = async (words: VocabularyWord[]): Promise<void> => {
  const db = await getDatabase();

  for (const entry of words) {
    const [existing] = await db.executeSql(
      'SELECT id FROM vocabulary_word WHERE word = ? AND lang = ? LIMIT 1',
      [entry.word, entry.lang],
    );

    if (existing.rows.length > 0) {
      continue;
    }

    const [groupResult] = await db.executeSql(
      'INSERT INTO vocabulary_group DEFAULT VALUES',
    );
    const groupId: number = groupResult.insertId;

    await db.executeSql(
      'INSERT INTO vocabulary_word (group_id, word, phonetic, lang, category) VALUES (?, ?, ?, ?, ?)',
      [groupId, entry.word, entry.phonetic, entry.lang, entry.category ?? null],
    );

    for (const translation of entry.translations) {
      await db.executeSql(
        'INSERT INTO vocabulary_word (group_id, word, phonetic, lang, category) VALUES (?, ?, ?, ?, ?)',
        [
          groupId,
          translation.word,
          translation.phonetic,
          translation.lang,
          translation.category,
        ],
      );
    }
  }
};

const getVocabulariesFromDb = async (
  languages: LanguageEnum[],
): Promise<VocabularyWord[]> => {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    'SELECT * FROM vocabulary_word ORDER BY word',
  );

  const words: VocabularyWord[] = [];

  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows.item(i);

    if (!languages.includes(row.lang)) {
      continue;
    }

    const [translationsResult] = await db.executeSql(
      'SELECT * FROM vocabulary_word WHERE group_id = ? AND id != ?',
      [row.group_id, row.id],
    );

    const translations: VocabularyTranslation[] = [];

    for (let j = 0; j < translationsResult.rows.length; j++) {
      const t = translationsResult.rows.item(j);
      translations.push({
        id: t.id,
        fk_groupId: t.group_id,
        word: t.word,
        phonetic: t.phonetic,
        lang: t.lang,
        category: t.category,
      });
    }

    words.push({
      word: row.word,
      phonetic: row.phonetic,
      lang: row.lang,
      category: row.category,
      groupId: row.group_id,
      translations,
    });
  }
  return words;
};

const getWordsByLang = async (lang: string): Promise<VocabularyWord[]> => {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    'SELECT * FROM vocabulary_word WHERE lang = ? ORDER BY word',
    [lang],
  );

  const words: VocabularyWord[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows.item(i);
    const [translationsResult] = await db.executeSql(
      'SELECT * FROM vocabulary_word WHERE group_id = ? AND id != ?',
      [row.group_id, row.id],
    );
    const translations: VocabularyTranslation[] = [];
    for (let j = 0; j < translationsResult.rows.length; j++) {
      const t = translationsResult.rows.item(j);
      translations.push({
        id: t.id,
        fk_groupId: t.group_id,
        word: t.word,
        phonetic: t.phonetic,
        lang: t.lang,
        category: t.category,
      });
    }
    words.push({
      word: row.word,
      phonetic: row.phonetic,
      lang: row.lang,
      category: row.category,
      translations,
    });
  }
  return words;
};

const searchWords = async (
  query: string,
  lang?: string,
): Promise<VocabularyWord[]> => {
  const db = await getDatabase();
  const [result] = await db.executeSql(
    lang
      ? 'SELECT * FROM vocabulary_word WHERE word LIKE ? AND lang = ? ORDER BY word LIMIT 50'
      : 'SELECT * FROM vocabulary_word WHERE word LIKE ? ORDER BY word LIMIT 50',
    lang ? [`%${query}%`, lang] : [`%${query}%`],
  );

  const words: VocabularyWord[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows.item(i);
    const [translationsResult] = await db.executeSql(
      'SELECT * FROM vocabulary_word WHERE group_id = ? AND id != ?',
      [row.group_id, row.id],
    );
    const translations: VocabularyTranslation[] = [];
    for (let j = 0; j < translationsResult.rows.length; j++) {
      const t = translationsResult.rows.item(j);
      translations.push({
        id: t.id,
        fk_groupId: t.group_id,
        word: t.word,
        phonetic: t.phonetic,
        lang: t.lang,
        category: t.category,
      });
    }
    words.push({
      word: row.word,
      phonetic: row.phonetic,
      lang: row.lang,
      category: row.category,
      translations,
    });
  }
  return words;
};

const deleteGroup = async (groupId: number): Promise<void> => {
  const db = await getDatabase();
  await db.executeSql('DELETE FROM vocabulary_word WHERE group_id = ?', [
    groupId,
  ]);
  await db.executeSql('DELETE FROM vocabulary_group WHERE id = ?', [groupId]);
};

export {
  importWordList,
  getVocabulariesFromDb,
  getWordsByLang,
  searchWords,
  deleteGroup,
};
