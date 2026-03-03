/**
 * src/utils/difficulty.js
 * Função: calcula tiers de dificuldade (easy/medium/hard) por popularidade.
 */

export function tierByPopularity(items, getPop) {
  const arr = (items ?? []).map((it) => ({ it, pop: Number(getPop(it) ?? 0) }));
  // ordena por pop desc
  arr.sort((a, b) => b.pop - a.pop);

  const n = arr.length;
  const cut1 = Math.floor(n / 3);
  const cut2 = Math.floor((2 * n) / 3);

  const out = new Map();
  arr.forEach((x, idx) => {
    let tier = 'hard';
    if (idx < cut1) tier = 'easy';
    else if (idx < cut2) tier = 'medium';
    out.set(x.it, tier);
  });

  return out;
}

export function pickTierSubset(items, tier) {
  const list = (items ?? []).filter((x) => x.tier === tier);
  if (list.length) return list;
  // fallback: se não existir tier (ex.: pool pequeno), volta tudo
  return items ?? [];
}
