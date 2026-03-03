/**
 * src/utils/dataLoader.js
 * Função: carrega e prepara os pools para:
 * - Bíblia: versículo -> escolher a REFERÊNCIA (Livro cap:verso)
 * - Hinário: estrofe -> escolher o HINO (Nº — Título)
 *
 * Também usa arquivos de popularidade (common_passages/common_hymns) para balancear dificuldade.
 */
import { RAW_LIST } from '../data/rawList';
import { tierByPopularity } from './difficulty';

const antigo = new Set([
  'Gênesis', 'Êxodo', 'Levítico', 'Números', 'Deuteronômio',
  'Josué', 'Juízes', 'Rute', '1 Samuel', '2 Samuel',
  '1 Reis', '2 Reis', '1 Crônicas', '2 Crônicas', 'Esdras',
  'Neemias', 'Ester', 'Jó', 'Salmos', 'Provérbios',
  'Eclesiastes', 'Cantares', 'Isaías', 'Jeremias', 'Lamentações',
  'Ezequiel', 'Daniel', 'Oséias', 'Joel', 'Amós',
  'Obadias', 'Jonas', 'Miquéias', 'Naum', 'Habacuque',
  'Sofonias', 'Ageu', 'Zacarias', 'Malaquias',
]);

const novo = new Set([
  'Mateus', 'Marcos', 'Lucas', 'João', 'Atos',
  'Romanos', '1 Coríntios', '2 Coríntios', 'Gálatas', 'Efésios',
  'Filipenses', 'Colossenses', '1 Tessalonicenses', '2 Tessalonicenses',
  '1 Timóteo', '2 Timóteo', 'Tito', 'Filemom', 'Hebreus',
  'Tiago', '1 Pedro', '2 Pedro', '1 João', '2 João',
  '3 João', 'Judas', 'Apocalipse',
]);

const corrections = {
  'II Corintios': '2 Coríntios', 'II Coríntios': '2 Coríntios',
  'I Coríntios': '1 Coríntios', 'I Corintios': '1 Coríntios',
  'I Reis': '1 Reis', 'II Reis': '2 Reis',
  'I Samuel': '1 Samuel', 'II Samuel': '2 Samuel',
  'I Pedro': '1 Pedro', 'II Pedro': '2 Pedro',
  'I João': '1 João', 'II João': '2 João', 'III João': '3 João',
  'I Tessalonicenses': '1 Tessalonicenses', 'II Tessalonicenses': '2 Tessalonicenses',
  'I Timóteo': '1 Timóteo', 'II Timóteo': '2 Timóteo',
  'I Crônicas': '1 Crônicas', 'II Crônicas': '2 Crônicas',
  'Cantares de Salomão': 'Cantares',
  'Lamentações de Jeremias': 'Lamentações',
  'Apocalipse - 22': 'Apocalipse',
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getBookName(bookObj) {
  return bookObj?.name || bookObj?.book || bookObj?.nome || null;
}

export function classifyBooks(bibleData) {
  const bookTestament = {};
  for (const book of bibleData) {
    const nome = getBookName(book);
    if (!nome) continue;
    if (antigo.has(nome)) bookTestament[nome] = 'Antigo';
    else if (novo.has(nome)) bookTestament[nome] = 'Novo';
    else bookTestament[nome] = 'Desconhecido';
  }
  return bookTestament;
}

export function normalizeBookName(rawName, bibleData) {
  if (!bibleData?.length) return null;
  let clean = (rawName || '').trim();
  if (corrections[clean]) clean = corrections[clean];

  for (const book of bibleData) {
    const nome = getBookName(book);
    if (nome && nome.toLowerCase() === clean.toLowerCase()) return nome;
  }
  for (const book of bibleData) {
    const nome = getBookName(book);
    if (nome && nome.toLowerCase().includes(clean.toLowerCase())) return nome;
  }
  return null;
}

export function getVerseText(bibleData, bookName, chapter, verse) {
  for (const book of bibleData) {
    const nome = getBookName(book);
    if (nome !== bookName) continue;
    try {
      const ch = book.chapters?.[chapter - 1];
      if (!ch) return null;
      return ch?.[verse - 1] ?? null;
    } catch {
      return null;
    }
  }
  return null;
}

function parseRawLine(line) {
  // equivalente ao Python:
  // re.search(r'([^\d]+?)[,\s-]*(\d+)[\.:\s-]*(\d+)?', line)
  const re = /([^\d]+?)[,\s-]*(\d+)[\.:\s-]*(\d+)?/;
  const match = String(line).match(re);
  if (!match) return null;
  const rawBook = match[1].trim().replace(/-/g, '').replace(/,/g, '');
  const chapter = parseInt(match[2], 10);
  const verse = match[3] ? parseInt(match[3], 10) : 1;
  return { rawBook, chapter, verse };
}

export function buildBiblePoolFromList(bibleData) {
  const bookTestament = classifyBooks(bibleData);
  const pool = [];
  const seen = new Set();

  const lines = (RAW_LIST || '').split('\n');
  for (const line of lines) {
    if (!line || !line.trim()) continue;
    const parsed = parseRawLine(line);
    if (!parsed) continue;

    const realBook = normalizeBookName(parsed.rawBook, bibleData);
    if (!realBook) continue;

    const text = getVerseText(bibleData, realBook, parsed.chapter, parsed.verse);
    if (!text) continue;

    const ref = `${realBook} ${parsed.chapter}:${parsed.verse}`;
    if (seen.has(ref)) continue;
    seen.add(ref);

    pool.push({
      type: 'bible',
      ref,
      text,
      book: realBook,
      testament: bookTestament[realBook] || 'Desconhecido',
      pop: 0,
      tier: 'medium',
    });
  }
  return shuffle(pool);
}

function isLikelyGenealogy(text) {
  const t = String(text || '').toLowerCase();
  // heurística simples: genealogias costumam ter muitos nomes/gerou/filho/idade
  const hits = [
    /\bgerou\b/g,
    /\bfilho\b/g,
    /\bfilhos\b/g,
    /\bidade\b/g,
    /\bgerações\b/g,
  ];
  let score = 0;
  for (const rx of hits) {
    const m = t.match(rx);
    if (m) score += m.length;
  }
  // muitos separadores e nomes
  const commas = (t.match(/,/g) || []).length;
  if (commas >= 3) score += 2;
  return score >= 3;
}

async function yieldToUI() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export async function buildExtraBiblePool(bibleData, alreadyRefsSet, limit = 2000) {
  // pega mais versículos do arc.json (evita genealogias e textos extremos)
  // Para não travar o app, faz yield a cada N iterações.
  const bookTestament = classifyBooks(bibleData);
  const pool = [];
  let processed = 0;

  for (const book of bibleData) {
    const bookName = getBookName(book);
    if (!bookName) continue;
    const chapters = book.chapters || [];
    for (let ci = 0; ci < chapters.length; ci++) {
      const verses = chapters[ci] || [];
      for (let vi = 0; vi < verses.length; vi++) {
        processed += 1;
        if (processed % 2000 === 0) await yieldToUI();

        const text = verses[vi];
        if (!text) continue;

        const len = String(text).length;
        if (len < 55 || len > 220) continue; // evita trechos muito curtos ou muito longos
        if (isLikelyGenealogy(text)) continue;

        const ref = `${bookName} ${ci + 1}:${vi + 1}`;
        if (alreadyRefsSet.has(ref)) continue;

        // amostragem simples: pega alguns para completar até o limite
        pool.push({
          type: 'bible',
          ref,
          text,
          book: bookName,
          testament: bookTestament[bookName] || 'Desconhecido',
          pop: 0,
          tier: 'hard',
        });

        if (pool.length >= limit) return shuffle(pool);
      }
    }
  }
  return shuffle(pool);
}

function parseCommonPassage(passageStr) {
  // exemplos:
  // "Lucas - 24:13" => book=Lucas chapter=24 verse=13
  // "Mateus - 11" => book=Mateus chapter=11 verse=1
  // "Ageu - 2-1:9" => book=Ageu chapter=2 verse=1
  const s = String(passageStr || '').trim();
  const parts = s.split('-').map(x => x.trim());
  if (parts.length < 2) return null;
  const bookRaw = parts[0].trim();

  const rest = parts.slice(1).join('-').trim().replace(/"/g,'');
  // 2-1:9
  let m = rest.match(/(\d+)\s*-\s*(\d+)\s*:\s*(\d+)/);
  if (m) return { bookRaw, chapter: parseInt(m[1],10), verse: parseInt(m[2],10) };
  // 24:13
  m = rest.match(/(\d+)\s*:\s*(\d+)/);
  if (m) return { bookRaw, chapter: parseInt(m[1],10), verse: parseInt(m[2],10) };
  // 11
  m = rest.match(/(\d+)/);
  if (m) return { bookRaw, chapter: parseInt(m[1],10), verse: 1 };
  return null;
}

export function buildBiblePopularityMap(commonPassages, bibleData) {
  // retorna Map(ref -> count)
  const map = new Map();
  for (const r of commonPassages ?? []) {
    const parsed = parseCommonPassage(r.passage);
    if (!parsed) continue;
    const book = normalizeBookName(parsed.bookRaw, bibleData);
    if (!book) continue;
    const ref = `${book} ${parsed.chapter}:${parsed.verse}`;
    const prev = map.get(ref) || 0;
    map.set(ref, prev + Number(r.count ?? 0));
  }
  return map;
}

export function buildHymnStanzaPool(hymns, commonHymnsMap) {
  const out = [];
  for (const h of hymns ?? []) {
    const numero = h.numero;
    const titulo = h.titulo || '';
    const pop = Number(commonHymnsMap?.[String(numero)] ?? 0);
    for (const e of h.estrofes ?? []) {
      const stanzaNumero = e.numero;
      const text = e.texto || '';
      if (!text || String(text).length < 40) continue;
      out.push({
        type: 'hymn',
        hymnNumero: numero,
        hymnTitulo: titulo,
        stanzaNumero,
        text,
        pop,
        tier: 'medium',
      });
    }
  }
  return shuffle(out);
}

export async function buildAllPoolsAsync({ bibleData, hymns, commonPassages, commonHymns }) {
  // Bible pool
  const bibleListPool = buildBiblePoolFromList(bibleData);
  const refSet = new Set(bibleListPool.map(x => x.ref));
  const extra = await buildExtraBiblePool(bibleData, refSet, 1800);
  const biblePool = shuffle([...bibleListPool, ...extra]);

  // Apply popularity tiers to bible
  const popMap = buildBiblePopularityMap(commonPassages, bibleData);
  for (const q of biblePool) {
    q.pop = Number(popMap.get(q.ref) || 0);
  }
  const bibleTierMap = tierByPopularity(biblePool, (it) => it.pop);
  for (const q of biblePool) q.tier = bibleTierMap.get(q) || 'medium';

  // Hymn pool (flatten stanzas)
  const hymnStanzas = buildHymnStanzaPool(hymns, commonHymns);
  const hymnTierMap = tierByPopularity(hymnStanzas, (it) => it.pop);
  for (const q of hymnStanzas) q.tier = hymnTierMap.get(q) || 'medium';

  return { biblePool, hymnPool: hymnStanzas };
}
