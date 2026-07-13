# Roteiro de captura de screenshots

## Automático (preferido)

```bash
# Produção ou preview
node scripts/capture-screenshots.mjs https://verbo-hino.vercel.app
```

Gera em `assets/screenshots/`:

- `01-game-bible-mobile.png`
- `02-game-hymn-mobile.png`
- `03-game-timeattack-mobile.png`
- `04-stats-empty-or-summary-mobile.png`
- `05-game-desktop.png`

Requisito: Chromium via Playwright (`npx playwright install chromium`).

## Manual

1. Abrir a demo em DevTools → iPhone 12/13 (390×844).  
2. Capturar Bíblia clássico, Hinário, Relógio, Stats.  
3. Desktop 1280×800.  
4. **Sem PII:** limpar histórico antes se houver nomes/dados pessoais no export.

## Uso no README

Referenciar apenas arquivos versionados em `assets/screenshots/`. Não commitar exports JSON reais de histórico.
