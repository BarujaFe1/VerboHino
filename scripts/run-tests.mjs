import { execSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const esbuild = path.join(root, 'node_modules', '.bin', 'esbuild');
const alias = [
  `--alias:react-native=./test/stubs/react-native.js`,
  `--alias:@react-native-async-storage/async-storage=./test/stubs/react-native.js`,
  `--alias:expo-file-system=./test/stubs/expo-file-system.js`,
  `--alias:expo-sharing=./test/stubs/expo-sharing.js`,
  `--alias:expo-document-picker=./test/stubs/expo-document-picker.js`,
].join(' ');

function run(cmd) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: root });
}

try {
  run(`${esbuild} test/logic.test.mjs --bundle --platform=node --format=esm --outfile=test/logic.bundle.mjs --log-level=warning`);
  run(`node test/logic.bundle.mjs`);

  run(`${esbuild} test/stats.test.mjs --bundle --platform=node --format=esm --outfile=test/stats.bundle.mjs ${alias} --log-level=warning`);
  run(`node test/stats.bundle.mjs`);

  console.log('\n=== TODOS OS TESTES PASSARAM ===');
  process.exit(0);
} catch (e) {
  console.error('\n=== FALHA NOS TESTES ===');
  process.exit(1);
}
