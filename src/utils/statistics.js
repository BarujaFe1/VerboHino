/**
 * src/utils/statistics.js
 * Função: histórico + estatísticas, equivalente ao Statistics do Python, agora com 2 tipos (bíblia / hinário).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@quiz_history_v2';

export async function loadHistory() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveHistory(history) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(history ?? []));
  } catch {
    // ignore
  }
}

export function addRecord(history, record) {
  const safe = {
    type: record.type, // 'bible' | 'hymn'
    correct: !!record.correct,
    mode: record.mode || 'classic',
    difficulty: record.difficulty || 'easy',
    timestamp: record.timestamp || new Date().toISOString(),

    // Bible
    book: record.book || null,
    ref: record.ref || null,

    // Hymn
    hymnNumero: record.hymnNumero ?? null,
    hymnTitulo: record.hymnTitulo ?? null,
    stanzaNumero: record.stanzaNumero ?? null,
  };
  return [...(history ?? []), safe];
}

export function overallAccuracy(history) {
  const total = (history ?? []).length;
  if (!total) return 0;
  const correct = (history ?? []).filter(r => r.correct).length;
  return correct / total;
}

export function accuracyByType(history) {
  const by = { bible: { total: 0, correct: 0 }, hymn: { total: 0, correct: 0 } };
  for (const r of history ?? []) {
    const t = r.type === 'hymn' ? 'hymn' : 'bible';
    by[t].total += 1;
    if (r.correct) by[t].correct += 1;
  }
  return {
    bible: by.bible.total ? by.bible.correct / by.bible.total : 0,
    hymn: by.hymn.total ? by.hymn.correct / by.hymn.total : 0,
  };
}

export function statsBibleByBook(history) {
  const map = {};
  for (const r of history ?? []) {
    if (r.type !== 'bible') continue;
    const k = r.book || 'Desconhecido';
    if (!map[k]) map[k] = { total: 0, correct: 0 };
    map[k].total += 1;
    if (r.correct) map[k].correct += 1;
  }
  return map;
}

export function statsHymnByNumero(history) {
  const map = {};
  for (const r of history ?? []) {
    if (r.type !== 'hymn') continue;
    const k = String(r.hymnNumero ?? '—');
    if (!map[k]) map[k] = { total: 0, correct: 0, titulo: r.hymnTitulo || '' };
    map[k].total += 1;
    if (r.correct) map[k].correct += 1;
    if (!map[k].titulo && r.hymnTitulo) map[k].titulo = r.hymnTitulo;
  }
  return map;
}
