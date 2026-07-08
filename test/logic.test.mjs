import { buildAllPoolsAsync } from '../src/utils/dataLoader.js';
import { createQuestion } from '../src/utils/questionFactory.js';
import { tierByPopularity } from '../src/utils/difficulty.js';
import fs from 'fs';
import path from 'path';

const ASSETS = path.join(process.cwd(), 'assets');
const load = (f) => JSON.parse(fs.readFileSync(path.join(ASSETS, f), 'utf8'));

const bibleData = load('arc.json');
const hymns = load('hinario_pronto.json');
const commonPassages = load('common_passages.json');
const commonHymns = load('common_hymns.json');

let failures = 0;
function fail(msg) { failures++; console.log('FAIL:', msg); }

async function main() {
  const { biblePool, hymnPool } = await buildAllPoolsAsync({ bibleData, hymns, commonPassages, commonHymns });

  console.log('biblePool size:', biblePool.length);
  console.log('hymnPool size:', hymnPool.length);

  if (!biblePool.length) fail('biblePool vazio');
  if (!hymnPool.length) fail('hymnPool vazio');

  // sanity: every bible item has valid structure
  for (const q of biblePool) {
    if (!q.ref || !q.text || !q.book || !q.testament) fail('bible item incompleto: ' + JSON.stringify(q).slice(0, 80));
    if (typeof q.text !== 'string' || q.text.length < 1) fail('bible texto invalido');
  }
  // sanity: every hymn item
  for (const q of hymnPool) {
    if (q.hymnNumero == null || !q.hymnTitulo || q.stanzaNumero == null || !q.text) fail('hymn item incompleto');
  }

  // tiers distribution
  const tiers = (pool) => { const m = {}; for (const q of pool) m[q.tier] = (m[q.tier] || 0) + 1; return m; };
  console.log('bible tiers:', JSON.stringify(tiers(biblePool)));
  console.log('hymn tiers:', JSON.stringify(tiers(hymnPool)));

  // FUZZ: generate many questions for each gameType x difficulty
  const recentIds = new Set();
  const N = 4000;
  for (const gameType of ['bible', 'hymn']) {
    const pool = gameType === 'bible' ? biblePool : hymnPool;
    for (const difficulty of ['easy', 'medium', 'hard']) {
      let okCount = 0;
      for (let i = 0; i < N; i++) {
        let q;
        try {
          q = createQuestion({ gameType, biblePool, hymnPool, difficulty, recentIds });
        } catch (e) {
          fail(`createQuestion threw (${gameType}/${difficulty}): ${e.message}`);
          break;
        }
        if (!q) { fail(`createQuestion retornou undefined (${gameType}/${difficulty})`); break; }
        // invariants
        if (!Array.isArray(q.options)) { fail(`${gameType}/${difficulty}: options nao é array`); break; }
        if (q.options.length !== 4) { fail(`${gameType}/${difficulty}: options != 4 (${q.options.length})`); break; }
        if (!q.options.includes(q.correctLabel)) { fail(`${gameType}/${difficulty}: correctLabel nao esta em options`); break; }
        const uniq = new Set(q.options);
        if (uniq.size !== q.options.length) { fail(`${gameType}/${difficulty}: options duplicadas`); break; }
        for (const o of q.options) if (typeof o !== 'string' || !o.trim()) { fail(`${gameType}/${difficulty}: opcao invalida`); break; }
        if (!q.promptText || typeof q.promptText !== 'string') { fail(`${gameType}/${difficulty}: promptText invalido`); break; }
        if (!q.hint) { fail(`${gameType}/${difficulty}: hint vazio`); break; }
        recentIds.add(q.id);
        okCount++;
      }
      console.log(`${gameType}/${difficulty}: ${okCount} perguntas OK`);
    }
  }

  // Test distractor correctness: for bible, distractors should differ from correct ref
  // and for hard mode, prefer same book/testament
  let hardSameTest = 0, hardTotal = 0;
  for (let i = 0; i < 2000; i++) {
    const q = createQuestion({ gameType: 'bible', biblePool, hymnPool, difficulty: 'hard', recentIds: new Set() });
    if (!q) continue;
    const correctRef = q.correctLabel;
    const correctBook = q.meta.book;
    for (const o of q.options) {
      if (o === correctRef) continue;
      hardTotal++;
      // distractor ref -> book
      const book = o.split(' ')[0];
      if (book === correctBook) hardSameTest++;
    }
  }
  console.log(`bible hard: distratores do mesmo livro = ${hardSameTest}/${hardTotal} (${((hardSameTest/hardTotal)*100).toFixed(1)}%)`);

  console.log(failures === 0 ? '\n=== TODOS OS TESTES PASSARAM ===' : `\n=== ${failures} FALHAS ===`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('CRASH:', e); process.exit(2); });
