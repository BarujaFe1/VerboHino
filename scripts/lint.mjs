/**
 * Checagens leves de qualidade para CI / DX local.
 * Não substitui ESLint completo — valida estrutura e imports críticos.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failures = 0;

function fail(msg) {
  failures += 1;
  console.error('FAIL:', msg);
}

function ok(msg) {
  console.log('ok:', msg);
}

function mustExist(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) fail(`arquivo ausente: ${rel}`);
  else ok(rel);
}

mustExist('App.js');
mustExist('app.json');
mustExist('package.json');
mustExist('src/screens/GameScreen.js');
mustExist('src/screens/StatsScreen.js');
mustExist('src/utils/exporters.js');
mustExist('src/utils/questionFactory.js');
mustExist('assets/arc.json');
mustExist('assets/hinario_pronto.json');
mustExist('.github/workflows/ci.yml');
mustExist('docs/AUDIT_REPORT.md');
mustExist('docs/HANDOFF.md');

const exporters = fs.readFileSync(path.join(root, 'src/utils/exporters.js'), 'utf8');
if (!exporters.includes("expo-file-system/legacy")) {
  fail('exporters.js deve importar expo-file-system/legacy (SDK 54)');
} else {
  ok('exporters usa expo-file-system/legacy');
}

if (exporters.match(/from ['"]expo-file-system['"]/)) {
  fail('exporters.js não deve importar expo-file-system (sem /legacy)');
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
for (const script of ['start', 'test', 'export:web', 'lint']) {
  if (!pkg.scripts?.[script]) fail(`script ausente em package.json: ${script}`);
  else ok(`script ${script}`);
}

console.log(failures === 0 ? '\n=== LINT OK ===' : `\n=== ${failures} FALHAS ===`);
process.exit(failures === 0 ? 0 : 1);
