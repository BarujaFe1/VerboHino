const fs = require('fs');
const arc = JSON.parse(fs.readFileSync('assets/arc.json', 'utf8'));
const raw = fs.readFileSync('src/data/rawList.js', 'utf8');
const list = raw.split('export const RAW_LIST = `')[1].split('`')[0].trim().split('\n');
const antigo = new Set(['Gênesis','Êxodo','Levítico','Números','Deuteronômio','Josué','Juízes','Rute','1 Samuel','2 Samuel','1 Reis','2 Reis','1 Crônicas','2 Crônicas','Esdras','Neemias','Ester','Jó','Salmos','Provérbios','Eclesiastes','Cantares','Isaías','Jeremias','Lamentações','Ezequiel','Daniel','Oséias','Joel','Amós','Obadias','Jonas','Miquéias','Naum','Habacuque','Sofonias','Ageu','Zacarias','Malaquias','Cânticos','Lamentações de Jeremias']);
const novo = new Set(['Mateus','Marcos','Lucas','João','Atos','Romanos','1 Coríntios','2 Coríntios','Gálatas','Efésios','Filipenses','Colossenses','1 Tessalonicenses','2 Tessalonicenses','1 Timóteo','2 Timóteo','Tito','Filemom','Hebreus','Tiago','1 Pedro','2 Pedro','1 João','2 João','3 João','Judas','Apocalipse']);
const corr = {'II Corintios':'2 Coríntios','II Coríntios':'2 Coríntios','I Coríntios':'1 Coríntios','I Corintios':'1 Coríntios','I Reis':'1 Reis','II Reis':'2 Reis','I Samuel':'1 Samuel','II Samuel':'2 Samuel','I Pedro':'1 Pedro','II Pedro':'2 Pedro','I João':'1 João','II João':'2 João','III João':'3 João','I Tessalonicenses':'1 Tessalonicenses','II Tessalonicenses':'2 Tessalonicenses','I Timóteo':'1 Timóteo','II Timóteo':'2 Timóteo','I Crônicas':'1 Crônicas','II Crônicas':'2 Crônicas','Cantares de Salomão':'Cânticos','Colossenes':'Colossenses','Lamentações de Jeremias':'Lamentações','Apocalipse - 22':'Apocalipse'};
const names = new Set(arc.map((b) => b.name || b.book || b.nome));
function norm(s) { s = (s || '').trim(); if (corr[s]) s = corr[s]; for (const n of names) { if (n.toLowerCase() === s.toLowerCase()) return n; if (n.toLowerCase().includes(s.toLowerCase())) return n; } return null; }
function verse(b, c, v) { const book = arc.find((x) => (x.name || x.book || x.nome) === b); if (!book) return null; const ch = book.chapters && book.chapters[c - 1]; return ch ? ch[v - 1] : null; }
let ok = 0, bad = 0; const badlist = [];
for (const line of list) {
  if (!line.trim()) continue;
  const m = String(line).match(/([^\d]+?)[,\s-]*(\d+)[\.:\s-]*(\d+)?/);
  if (!m) { bad++; if (badlist.length < 10) badlist.push(line + ' -> parse?'); continue; }
  const rb = m[1].trim().replace(/-/g, '').replace(/,/g, '');
  const c = parseInt(m[2], 10); const v = m[3] ? parseInt(m[3], 10) : 1;
  const b = norm(rb);
  if (!b) { bad++; if (badlist.length < 10) badlist.push(line + ' -> livro? ' + rb); continue; }
  if (verse(b, c, v)) ok++; else { bad++; if (badlist.length < 10) badlist.push(line + ' -> ' + b + ' ' + c + ':' + v + ' (sem texto)'); }
}
console.log('resolvem:', ok, '| falham:', bad);
console.log('amostra falhas:', badlist.join(' | '));
