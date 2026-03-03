/**
 * src/utils/exporters.js
 * Função: exportar/importar histórico em JSON + exportar CSV (histórico e agregados).
 */
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

function safeFilename(name) {
  return name.replace(/[^a-z0-9_\-\.]/gi, '_');
}

async function shareFile(uri, mimeType) {
  const can = await Sharing.isAvailableAsync();
  if (!can) return { ok: false, reason: 'sharing_unavailable' };
  await Sharing.shareAsync(uri, { mimeType });
  return { ok: true };
}

export async function exportHistoryJSON(history) {
  const filename = safeFilename(`history_${new Date().toISOString()}.json`);
  const uri = FileSystem.cacheDirectory + filename;
  await FileSystem.writeAsStringAsync(uri, JSON.stringify(history ?? [], null, 2), {
    encoding: FileSystem.EncodingType.UTF8,
  });
  return shareFile(uri, 'application/json');
}

export async function importHistoryJSON() {
  const res = await DocumentPicker.getDocumentAsync({
    type: ['application/json', 'text/json', '*/*'],
    multiple: false,
    copyToCacheDirectory: true,
  });
  if (res.canceled) return { ok: false, canceled: true };

  const file = res.assets?.[0];
  if (!file?.uri) return { ok: false, reason: 'no_uri' };

  const txt = await FileSystem.readAsStringAsync(file.uri, { encoding: FileSystem.EncodingType.UTF8 });
  const parsed = JSON.parse(txt);
  if (!Array.isArray(parsed)) return { ok: false, reason: 'invalid_format' };

  // sanitiza
  const sanitized = parsed
    .filter(r => r && typeof r === 'object')
    .map(r => ({
      type: r.type === 'hymn' ? 'hymn' : 'bible',
      correct: !!r.correct,
      mode: String(r.mode ?? 'classic'),
      difficulty: String(r.difficulty ?? 'easy'),
      timestamp: String(r.timestamp ?? new Date().toISOString()),
      book: r.book ? String(r.book) : null,
      ref: r.ref ? String(r.ref) : null,
      hymnNumero: (r.hymnNumero ?? null),
      hymnTitulo: r.hymnTitulo ? String(r.hymnTitulo) : null,
      stanzaNumero: (r.stanzaNumero ?? null),
    }));

  return { ok: true, history: sanitized };
}

function csvRow(cols) {
  return cols.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',');
}

export async function exportCSV({ history, bibleByBook, hymnByNumero }) {
  const now = new Date().toISOString();
  const lines = [];
  lines.push('TYPE,F1,F2,F3,F4,F5,F6');
  lines.push(csvRow(['meta', 'generated_at', now, '', '', '', '']));

  lines.push(csvRow(['section', 'history', '', '', '', '', '']));
  lines.push(csvRow(['history', 'type', 'correct', 'mode', 'difficulty', 'id', 'timestamp']));
  for (const r of history ?? []) {
    const id = r.type === 'hymn' ? `hino_${r.hymnNumero}` : (r.ref || '');
    lines.push(csvRow([
      'history',
      r.type,
      r.correct ? '1' : '0',
      r.mode,
      r.difficulty,
      id,
      r.timestamp
    ]));
  }

  lines.push(csvRow(['section', 'bible_by_book', '', '', '', '', '']));
  lines.push(csvRow(['book', 'name', 'correct', 'total', 'accuracy', '', '']));
  for (const [book, s] of Object.entries(bibleByBook ?? {})) {
    const acc = s.total ? (s.correct / s.total) : 0;
    lines.push(csvRow(['book', book, s.correct, s.total, acc.toFixed(4), '', '']));
  }

  lines.push(csvRow(['section', 'hymn_by_numero', '', '', '', '', '']));
  lines.push(csvRow(['hymn', 'numero', 'titulo', 'correct', 'total', 'accuracy', '']));
  for (const [num, s] of Object.entries(hymnByNumero ?? {})) {
    const acc = s.total ? (s.correct / s.total) : 0;
    lines.push(csvRow(['hymn', num, s.titulo || '', s.correct, s.total, acc.toFixed(4), '']));
  }

  const filename = safeFilename(`stats_${now}.csv`);
  const uri = FileSystem.cacheDirectory + filename;
  await FileSystem.writeAsStringAsync(uri, lines.join('\n'), { encoding: FileSystem.EncodingType.UTF8 });
  return shareFile(uri, 'text/csv');
}
