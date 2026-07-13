# Testing — Verbo & Hino

## Como rodar

```bash
npm test
```

O runner (`scripts/run-tests.mjs`) usa **esbuild** para empacotar os testes com stubs de módulos nativos e executa no Node.

```bash
npm run lint   # checagens estruturais + import crítico do FileSystem
npm run ci     # lint + test + export web
```

## O que é coberto

| Suite | Arquivo | Cobertura |
|---|---|---|
| Lógica de quiz | `test/logic.test.mjs` | Pools, tiers, **24.000** perguntas (6 combinações × 4000), unicidade de opções, hints, distratores hard |
| Stats / export | `test/stats.test.mjs` | Acurácia, agregações, `addRecord`, cap de histórico, `sanitizeHistory`, CSV/JSON |
| Lint estrutural | `scripts/lint.mjs` | Arquivos essenciais, scripts, import `expo-file-system/legacy` |

## Stubs

Em `test/stubs/`:

- `react-native.js` — Platform + AsyncStorage fake
- `expo-file-system.js` — captura writes (também alias de `/legacy`)
- `expo-sharing.js` / `expo-document-picker.js`

## O que não é coberto (ainda)

- Render de componentes / Navigation
- E2E no Expo Go ou emulador
- Visual regression
- Performance de carregamento do `arc.json` em devices lentos

## Como adicionar um teste

1. Preferir testar funções puras em `src/utils/`.
2. Se precisar de módulo nativo, adicione stub e alias no `run-tests.mjs`.
3. Rode `npm test` antes do commit.

## Critério de aceite de regressão

Qualquer mudança em `questionFactory`, `dataLoader`, `statistics` ou `exporters` **deve** manter `npm test` verde.
