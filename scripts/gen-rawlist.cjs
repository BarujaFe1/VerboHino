const fs = require('fs');
const cp = JSON.parse(fs.readFileSync('assets/common_passages.json', 'utf8'));
const lines = cp.map((r) => String(r.passage || '').trim()).filter(Boolean);
const header = [
  '/**',
  ' * src/data/rawList.js',
  ' * Lista bruta de referencias biblicas (versao ARC).',
  ' * Gerada a partir de assets/common_passages.json (passagens populares).',
  ' * Pode ser substituida por uma lista personalizada no mesmo formato:',
  ' *   "Livro, cap.verso"  ou  "Livro - cap:verso"',
  ' */',
  '',
].join('\n');
const body = 'export const RAW_LIST = `\n' + lines.join('\n') + '\n`;';
fs.writeFileSync('src/data/rawList.js', header + body);
console.log('rawList.js gerado com', lines.length, 'referencias');
