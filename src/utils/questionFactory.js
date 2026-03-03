/**
 * src/utils/questionFactory.js
 * Função: cria uma pergunta com 4 opções, com dificuldade e lógica de distratores.
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function formatHymnOption(q) {
  const t = (q.hymnTitulo || '').trim();
  const shortTitle = t.length > 32 ? (t.slice(0, 32) + '…') : t;
  return `Nº ${q.hymnNumero} — ${shortTitle}`;
}

function numberRangeHint(n) {
  if (n == null) return 'Desconhecido';
  if (n <= 160) return '1–160';
  if (n <= 320) return '161–320';
  return '321–480';
}

function pickFromTier(pool, tier, recentIds, idFn) {
  const tierItems = pool.filter(x => x.tier === tier);
  const candidates = tierItems.length ? tierItems : pool;
  const filtered = candidates.filter(x => !recentIds.has(idFn(x)));
  if (filtered.length) return pickRandom(filtered);
  return pickRandom(candidates);
}

function buildBibleDistractors({ pool, correct, difficulty }) {
  const book = correct.book;
  const testament = correct.testament;

  let candidates = pool.filter(x => x.ref !== correct.ref);

  if (difficulty === 'hard') {
    // tenta do mesmo livro, senão mesmo testamento, senão geral
    const sameBook = candidates.filter(x => x.book === book);
    if (sameBook.length >= 3) candidates = sameBook;
    else {
      const sameTest = candidates.filter(x => x.testament === testament);
      if (sameTest.length >= 3) candidates = sameTest;
    }
  } else if (difficulty === 'medium') {
    const sameTest = candidates.filter(x => x.testament === testament);
    if (sameTest.length >= 3) candidates = sameTest;
  } else {
    // easy: distratores bem variados
    // remove do mesmo livro se possível
    const diffBook = candidates.filter(x => x.book !== book);
    if (diffBook.length >= 3) candidates = diffBook;
  }

  const picked = new Set();
  while (picked.size < 3 && candidates.length) {
    const x = pickRandom(candidates);
    picked.add(x.ref);
  }
  return Array.from(picked);
}

function buildHymnDistractors({ pool, correct, difficulty }) {
  const correctNum = correct.hymnNumero;
  let candidates = pool.filter(x => x.hymnNumero !== correctNum);

  if (difficulty === 'hard') {
    // tenta títulos "parecidos" (mesmas palavras)
    const ct = String(correct.hymnTitulo || '').toLowerCase().split(/\s+/).filter(Boolean);
    const tokenSet = new Set(ct);
    const similar = candidates.filter(x => {
      const tt = String(x.hymnTitulo || '').toLowerCase().split(/\s+/).filter(Boolean);
      let hit = 0;
      for (const t of tt) if (tokenSet.has(t)) hit++;
      return hit >= 1;
    });
    if (similar.length >= 3) candidates = similar;
  } else if (difficulty === 'easy') {
    // easy: remove candidatos com títulos muito parecidos para facilitar
    const ct = String(correct.hymnTitulo || '').toLowerCase();
    candidates = candidates.filter(x => !String(x.hymnTitulo || '').toLowerCase().includes(ct.slice(0, 6)));
  }

  const pickedNums = new Set();
  while (pickedNums.size < 3 && candidates.length) {
    const x = pickRandom(candidates);
    pickedNums.add(x.hymnNumero);
  }
  return Array.from(pickedNums);
}

export function createQuestion({ gameType, biblePool, hymnPool, difficulty, recentIds }) {
  if (gameType === 'hymn') {
    const idFn = (x) => `hymn_${x.hymnNumero}_${x.stanzaNumero}`;
    const correct = pickFromTier(hymnPool, difficulty, recentIds, idFn);

    // dificuldade também controla qual estrofe:
    // easy: prefere estrofe 1
    // hard: prefere estrofes 3+ quando existir
    let correctPicked = correct;
    if (difficulty === 'easy') {
      const sameHymnFirst = hymnPool.filter(x => x.hymnNumero === correct.hymnNumero && x.stanzaNumero === 1);
      if (sameHymnFirst.length) correctPicked = sameHymnFirst[0];
    } else if (difficulty === 'hard') {
      const sameHymnHard = hymnPool.filter(x => x.hymnNumero === correct.hymnNumero && x.stanzaNumero >= 3);
      if (sameHymnHard.length) correctPicked = pickRandom(sameHymnHard);
    }

    const distractorNums = buildHymnDistractors({ pool: hymnPool, correct: correctPicked, difficulty });

    const options = shuffle([
      formatHymnOption(correctPicked),
      ...distractorNums.map((n) => formatHymnOption({ hymnNumero: n, hymnTitulo: (hymnPool.find(x => x.hymnNumero === n)?.hymnTitulo) || '' })),
    ]);

    const hint = `Faixa do número: ${numberRangeHint(correctPicked.hymnNumero)}`;

    return {
      type: 'hymn',
      id: `hymn_${correctPicked.hymnNumero}_${correctPicked.stanzaNumero}`,
      promptText: correctPicked.text,
      correctLabel: formatHymnOption(correctPicked),
      options,
      hint,
      meta: {
        hymnNumero: correctPicked.hymnNumero,
        hymnTitulo: correctPicked.hymnTitulo,
        stanzaNumero: correctPicked.stanzaNumero,
      },
    };
  }

  // bible
  const idFn = (x) => x.ref;
  const correct = pickFromTier(biblePool, difficulty, recentIds, idFn);

  const distractorRefs = buildBibleDistractors({ pool: biblePool, correct, difficulty });
  const options = shuffle([correct.ref, ...distractorRefs]);

  const hint = `Testamento: ${correct.testament}`;

  return {
    type: 'bible',
    id: correct.ref,
    promptText: correct.text,
    correctLabel: correct.ref,
    options,
    hint,
    meta: {
      book: correct.book,
      ref: correct.ref,
      testament: correct.testament,
    },
  };
}
