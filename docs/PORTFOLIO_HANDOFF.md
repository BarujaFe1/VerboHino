# Portfolio Handoff — Verbo & Hino

**Data:** 13/07/2026  
**Branch de trabalho:** `chore/portfolio-quality-pass` (merged → `main` via [PR #1](https://github.com/BarujaFe1/VerboHino/pull/1))  
**Recomendação de papel no portfólio:** **Selecionado** (não “destaque único”; forte como produto multiplataforma + qualidade de domínio)

---

## 1. Resumo executivo

Verbo & Hino é um app **Expo/React Native** offline-first que gamifica estudo da Bíblia (ARC) e do Hinário CCB. Uma codebase gera **mobile + web** (Vercel). O valor para o portfólio de Felipe não é “mais uma UI de quiz”: é **produto completo** com pools grandes, regras de dificuldade, métricas locais, export/import, CI e documentação honesta.

**Nota atual:** ~**8.8/10** (evidência visual + deploy alinhado ao merge).

---

## 2. Before / After

| Dimensão | Antes | Depois |
|---|---|---|
| Export mobile (SDK 54) | Quebrado | `expo-file-system/legacy` |
| Portfólio docs/CI | Fracos/ausentes | `docs/*` + Actions verde |
| Import circular | Telas → App.js | `src/context/AppContext` |
| Screenshots | Placeholder | 5 capturas reais versionadas |
| Deploy prod vs branch | Dessincronizado | `main` merged; prod bundle atualizado |
| Label “Sobrevivência” | Truncava no mobile | Renomeado para **Vidas** |
| Claims | Infláveis | SECURITY_NOTES + claims proibidos documentados |

---

## 3. Achados priorizados (confirmados no código)

### P0
- Export/import nativo no Expo 54 — **corrigido**
- Nenhum segredo no repo — **OK**

### P1
- Deploy prod atrás da branch de qualidade — **resolvido** (merge PR #1; bundle prod mudou)
- Race de vidas / timer Relógio — **corrigidos em passes anteriores**

### P2
- Screenshots e empty states — **feitos**
- Truncamento “Sobrevivên…” — **corrigido** (label Vidas)
- TalkBack/VoiceOver físico — **pendente** (checklist em `docs/ACCESSIBILITY.md`)

### P3
- TypeScript gradual, EAS iOS, sync nuvem — roadmap

---

## 4. Comandos e gates

```bash
npm install
npm run lint
npm test              # ~24k perguntas + stats/sanitize/cap
npm run export:web
npm run screenshots   # Playwright → assets/screenshots/
npm run ci
```

**CI GitHub:** workflow `CI` — SUCCESS no PR #1.  
**Demo:** https://verbo-hino.vercel.app (HTTP 200; meta SEO presente).

---

## 5. Evidências visuais

| Arquivo | Conteúdo |
|---|---|
| `assets/screenshots/01-game-bible-mobile.png` | Quiz Bíblia |
| `assets/screenshots/02-game-hymn-mobile.png` | Quiz Hinário |
| `assets/screenshots/03-game-timeattack-mobile.png` | Modo Relógio + timer |
| `assets/screenshots/04-stats-mobile.png` | Empty state de Stats |
| `assets/screenshots/05-game-desktop.png` | Layout desktop |

Roteiro: `docs/demo/SCREENSHOT_CAPTURE.md` · Demo entrevista: `docs/demo/INTERVIEW_DEMO.md`

---

## 6. Limitações honestas

- Offline-only: sem sync entre dispositivos (export/import mitiga).
- Bundle web ~6.4 MB (ARC embutido).
- MIT cobre **código**, não direitos do texto ARC/hinário para lojas.
- Conta Vercel CLI atual (`baruja-fe`) pode não listar o projeto `verbo-hino` (deploy histórico em outro team); produção pública segue ativa via integração GitHub.
- A11y completa em dispositivo físico ainda não auditada.

---

## 7. Claims permitidos vs proibidos

**Permitidos:** offline-first; Expo multiplataforma; fuzz 24k; CI; stats locais; demo pública; privacidade (sem telemetria obrigatória).

**Proibidos:** “enterprise”, “IA”, “produção em escala”, “MIT libera o hinário/ARC”, “sync em nuvem”, “100% acessível VoiceOver” sem auditoria.

---

## 8. Próximos passos

1. Atualizar card do portfólio (`barujafe.vercel.app`) com screenshots + link demo.  
2. TalkBack em um aparelho Android.  
3. `eas build --profile preview` se quiser APK no README.  
4. Opcional: TypeScript nos utils de domínio.

---

## 9. Decisão de papel

| Papel | Veredito |
|---|---|
| Destaque absoluto | Não — há projetos de dados/estatística mais alinhados às vagas-alvo |
| **Selecionado** | **Sim** — produto completo, multiplataforma, qualidade demonstrável |
| Laboratório | Não — está além de lab descartável |
| Arquivo | Não |

**Posicionamento em entrevista:** “produto mobile/web com rigor de domínio e testes; complemento ao eixo analytics/dados, não substituto.”
