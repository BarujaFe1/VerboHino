/**
 * Captura screenshots públicos da demo web (sem PII).
 * Uso: node scripts/capture-screenshots.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const baseUrl = process.argv[2] || 'https://verbo-hino.vercel.app';
const outDir = path.join(process.cwd(), 'assets', 'screenshots');
fs.mkdirSync(outDir, { recursive: true });

async function shot(page, name) {
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, fullPage: false });
  console.log('saved', path.basename(file), fs.statSync(file).size);
}

async function clickText(page, text) {
  const loc = page.getByText(text, { exact: true }).first();
  if (await loc.count()) {
    await loc.click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(900);
    return true;
  }
  return false;
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  locale: 'pt-BR',
});
const page = await context.newPage();

await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForTimeout(4000);
await shot(page, '01-game-bible-mobile.png');

await clickText(page, 'Hinário');
await shot(page, '02-game-hymn-mobile.png');

await clickText(page, 'Relógio');
await shot(page, '03-game-timeattack-mobile.png');

// Stats: tenta label acessível ou ícone de gráfico via role
const stats = page.getByLabel(/estatísticas|stats|chart/i).first();
if (await stats.count()) {
  await stats.click().catch(() => {});
} else {
  // fallback: último botão do header (ordem: tema, stats, restart)
  const headerBtns = page.locator('header button, [role="banner"] button, button');
  const n = await headerBtns.count();
  if (n >= 2) await headerBtns.nth(1).click().catch(() => {});
}
await page.waitForTimeout(1200);
await shot(page, '04-stats-mobile.png');

await page.setViewportSize({ width: 1280, height: 800 });
await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
await page.waitForTimeout(4000);
await shot(page, '05-game-desktop.png');

await browser.close();
console.log('done');
