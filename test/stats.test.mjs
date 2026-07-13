import {
  overallAccuracy,
  accuracyByType,
  statsBibleByBook,
  statsHymnByNumero,
  addRecord,
  HISTORY_MAX_RECORDS,
} from '../src/utils/statistics.js';
import { exportHistoryJSON, exportCSV, sanitizeHistory } from '../src/utils/exporters.js';
import fsStub from 'expo-file-system';

let failures = 0;
function fail(m) { failures++; console.log('FAIL:', m); }
function eq(label, a, b) { if (a !== b) fail(`${label}: esperado ${b}, obtido ${a}`); else console.log('ok', label, '=', a); }

// sanitizeHistory
const sanitized = sanitizeHistory([
  { type: 'hymn', correct: 1, hymnNumero: 7, hymnTitulo: 'Teste' },
  null,
  'lixo',
]);
eq('sanitizeHistory.length', sanitized.length, 1);
eq('sanitizeHistory.type', sanitized[0].type, 'hymn');
eq('sanitizeHistory.rejectsNonArray', sanitizeHistory({ not: 'array' }), null);

// history cap
const capped = addRecord(Array.from({ length: HISTORY_MAX_RECORDS }, (_, i) => ({
  type: 'bible',
  correct: false,
  timestamp: `t${i}`,
})), { type: 'bible', correct: true, book: 'João', ref: 'João 3:16' });
eq('historyCap.length', capped.length, HISTORY_MAX_RECORDS);
eq('historyCap.keepsNewest', capped[capped.length - 1].correct, true);

const history = [
  { type: 'bible', correct: true, mode: 'classic', difficulty: 'easy', book: 'João', ref: 'João 3:16', timestamp: 't1' },
  { type: 'bible', correct: false, mode: 'classic', difficulty: 'easy', book: 'João', ref: 'João 3:16', timestamp: 't2' },
  { type: 'hymn', correct: true, mode: 'hard', difficulty: 'hard', hymnNumero: 1, hymnTitulo: 'Cristo', stanzaNumero: 1, timestamp: 't3' },
];

eq('overallAccuracy', overallAccuracy(history), 2 / 3);
const byType = accuracyByType(history);
eq('byType.bible', byType.bible, 0.5);
eq('byType.hymn', byType.hymn, 1);
const bb = statsBibleByBook(history);
eq('bibleByBook.João.total', bb['João'].total, 2);
eq('bibleByBook.João.correct', bb['João'].correct, 1);
const hn = statsHymnByNumero(history);
eq('hymnByNumero.1.total', hn['1'].total, 1);
eq('hymnByNumero.1.correct', hn['1'].correct, 1);

// addRecord sanity
const rec = addRecord([], { type: 'bible', correct: true, mode: 'classic', difficulty: 'easy', book: 'Gênesis', ref: 'Gênesis 1:1', timestamp: 't' });
eq('addRecord.length', rec.length, 1);
eq('addRecord.type', rec[0].type, 'bible');

// export CSV
fsStub.__clear();
const csvRes = await exportCSV({ history, bibleByBook: bb, hymnByNumero: hn });
const csv = fsStub.__getCaptured();
if (!csv) fail('exportCSV não gerou conteúdo');
else {
  const lines = csv.split('\n');
  console.log('CSV linhas:', lines.length);
  if (!csv.includes('TYPE,F1,F2,F3,F4,F5,F6')) fail('CSV cabecalho ausente');
  if (!csv.includes('history')) fail('CSV sem secao history');
  if (!csv.includes('João 3:16')) fail('CSV sem ref da biblia');
  if (!csv.includes('Cristo')) fail('CSV sem titulo do hino');
  if (!csv.includes('"1"')) fail('CSV sem numero do hino');
  // validar parseabilidade simples: contar colunas em cada linha
  for (const ln of lines) {
    const cols = ln.split(',');
    if (cols.length !== 7) { fail('CSV linha com colunas != 7: ' + ln.slice(0, 60)); break; }
  }
}
if (csvRes.ok !== false) console.log('obs: exportCSV retornou', JSON.stringify(csvRes), '(esperado ok:false pois sharing stub desativado)');

// export JSON
fsStub.__clear();
const jsonRes = await exportHistoryJSON(history);
const json = fsStub.__getCaptured();
if (!json) fail('exportHistoryJSON não gerou conteúdo');
else {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed) || parsed.length !== 3) fail('JSON export invalido');
    else console.log('ok JSON parseavel, itens =', parsed.length);
  } catch (e) { fail('JSON export nao é valido: ' + e.message); }
}

console.log(failures === 0 ? '\n=== STATS/EXPORT OK ===' : `\n=== ${failures} FALHAS ===`);
process.exit(failures === 0 ? 0 : 1);
