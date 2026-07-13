# Handoff — Portfolio Quality Pass

**Projeto:** Verbo & Hino (`BarujaFe1/VerboHino`)  
**Branch:** `chore/portfolio-quality-pass`  
**Data:** 13/07/2026

---

## O que foi encontrado

- App Expo 54 sólido (quiz, modos, stats, web na Vercel).
- Testes de domínio já existentes e verdes (~24k perguntas).
- **Bug crítico:** export/import no mobile quebrado — `expo-file-system` v19 lança erro se os métodos legacy forem importados do entrypoint principal.
- Lacunas de portfólio: sem `docs/` estruturados, sem CI, README pouco orientado a recrutador, empty states fracos, import sem confirmação, histórico sem teto.
- Nenhum segredo/credencial exposto no código-fonte.

## O que foi corrigido

1. `src/utils/exporters.js` → `expo-file-system/legacy` + try/catch no import nativo.
2. Timer do modo Relógio sem side-effect dentro de `setState`.
3. `createQuestion` sempre retorna 4 opções distintas (padding seguro).
4. Faixa de dica do hinário: `321–485`.
5. Cap de histórico em 5000 registros.
6. Confirmação ao importar / limpar histórico.
7. Empty states na tela de estatísticas.
8. `SafeAreaProvider` no `App.js`.
9. Labels de acessibilidade e `minHeight` de toque em botões.

## O que foi melhorado

- README reescrito como peça de portfólio.
- Docs: Audit, Architecture, Technical Decisions, Testing, Deployment, Handoff.
- CI GitHub Actions (`lint` + `test` + `export:web`).
- Scripts `lint` e `ci` no `package.json`.
- `.gitignore` e `.env.example` reforçados.
- Testes ampliados (`sanitizeHistory`, cap de histórico).
- Alias de teste para `expo-file-system/legacy`.

## Comandos rodados

```bash
npm test
npm run export:web
# (após mudanças) npm run lint && npm test
```

Node: v22.14.0 · npm: 10.9.2

## Testes executados

- `test/logic.test.mjs` — pools + fuzz 24k
- `test/stats.test.mjs` — stats, export, sanitize, cap
- `scripts/lint.mjs` — estrutura + import legacy
- Export web → `dist/` OK

## O que ainda falta

- Screenshots reais (mobile/web) no README.
- Redeploy Vercel após merge/push.
- Audit TalkBack/VoiceOver completo.
- Build iOS EAS (conta Apple).
- TypeScript opcional nos utils.
- E2E (Detox/Maestro) — fora do escopo deste passe.

## Riscos restantes

- Dataset do hinário / ARC: verificar direitos ao distribuir em lojas.
- Bundle web ~6.4 MB (ARC embutido) — aceitável, mas pesado em 3G.
- Sem sync entre dispositivos (mitigado por export).

## Próximos passos

1. Push da branch e abrir PR.
2. Conferir CI verde no GitHub.
3. Merge → redeploy Vercel.
4. Gerar APK preview (`npm run eas:preview`) e atualizar link no README.
5. Capturar 2–3 screenshots e substituir o placeholder.

## Sugestões para o portfólio

- Card: “Verbo & Hino — quiz offline Bíblia + Hinário CCB · Expo · Vercel”.
- Em entrevista: abrir a demo, jogar modo Relógio, mostrar Stats + export, citar o fuzz test e o fix do FileSystem SDK 54.
- Linkar este repo + https://verbo-hino.vercel.app + https://barujafe.vercel.app/

## Mensagem de commit sugerida

```txt
chore: improve portfolio quality, docs, tests and stability
```

## Arquivos-chave desta revisão

- `src/utils/exporters.js`
- `src/utils/questionFactory.js`
- `src/utils/statistics.js`
- `src/screens/StatsScreen.js`
- `src/screens/GameScreen.js`
- `App.js`
- `README.md`
- `docs/*`
- `.github/workflows/ci.yml`
