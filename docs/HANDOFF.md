# Handoff — Portfolio Quality Pass (2ª revisão)

**Projeto:** Verbo & Hino (`BarujaFe1/VerboHino`)  
**Branch:** `chore/portfolio-quality-pass`  
**Data:** 13/07/2026

---

## O que foi encontrado (baseline + 2ª passagem)

### Já resolvido no 1º passe (`39a8e12`)
- Bug crítico de export/import mobile (`expo-file-system` SDK 54 → `/legacy`)
- Cap de histórico, confirmações de import/limpar, empty states, a11y básica
- Timer do Relógio sem side-effect em `setState`
- README de portfólio, docs/, CI GitHub Actions, `.env.example`, lint estrutural
- CI **verde** no GitHub (`chore/portfolio-quality-pass`)

### Gaps encontrados nesta 2ª passagem
- Telas importavam contextos de `App.js` (**dependência circular**)
- Sem notas formais de segurança/privacidade/conteúdo
- Factory sem guard explícito para pools vazios
- Lint não garantia ausência de import circular
- Fuzz não detectava vazamento de fallback `"Opção N"`
- Preview do README ainda genérico

## O que foi corrigido / melhorado agora

1. **`src/context/AppContext.js`** — contextos + bootstrap; `App.js` só monta providers/nav.
2. **GameScreen / StatsScreen** importam de `../context/AppContext` (sem circular).
3. **`createQuestion`** lança erro claro se `biblePool`/`hymnPool` estiver vazio.
4. **`VerseCard`** — `accessibilityLabel` + `accessibilityLiveRegion` na dica.
5. **`docs/SECURITY_NOTES.md`** — privacidade, ausência de segredos, direitos de conteúdo.
6. **Lint** exige `AppContext`, `SECURITY_NOTES` e bloqueia import de `App.js` nas telas.
7. **Testes** — rejeição de pool vazio + invariante contra fallback sintético.
8. **README / Architecture** atualizados (context layer + preview com wordmark).

## Comandos rodados

```bash
npm run lint
npm test
npm run export:web   # quando aplicável
```

## Testes

- `test/logic.test.mjs` — pools + empty-pool + fuzz 24k + anti-fallback
- `test/stats.test.mjs` — sanitize, cap, CSV/JSON
- `scripts/lint.mjs` — estrutura + legacy FS + anti-circular

## O que ainda falta

- Screenshots de gameplay nativos (loja) — demo web cobre o gap de portfólio
- Redeploy Vercel após merge em `main` (site já em produção com código anterior)
- Audit TalkBack/VoiceOver completo
- Build EAS Android/iOS sob demanda
- TypeScript gradual nos utils

## Riscos restantes

- Direitos do dataset ARC/hinário ao publicar em lojas
- Bundle web ~6.4 MB (ARC embutido)
- Sem sync entre dispositivos (mitigado por export)

## Próximos passos

1. Abrir/atualizar PR `chore/portfolio-quality-pass` → `main`
2. Confirmar CI verde
3. Merge + redeploy Vercel se necessário
4. `npm run eas:preview` quando quiser APK público

## Sugestões de portfólio

- Card: “Verbo & Hino — quiz offline Bíblia + Hinário · Expo · Vercel”
- Em entrevista: demo Relógio → Stats → export; citar fuzz 24k + fix FileSystem SDK 54 + remoção do import circular
- Links: repo · https://verbo-hino.vercel.app · https://barujafe.vercel.app/

## Mensagem de commit

```txt
chore: deepen portfolio pass — context extraction, security notes, stronger tests
```

## Arquivos-chave desta 2ª passagem

- `src/context/AppContext.js`
- `App.js`
- `src/screens/GameScreen.js` / `StatsScreen.js`
- `src/utils/questionFactory.js`
- `src/components/VerseCard.js`
- `scripts/lint.mjs` / `test/logic.test.mjs`
- `docs/SECURITY_NOTES.md` / `docs/ARCHITECTURE.md` / `docs/HANDOFF.md` / `README.md`
