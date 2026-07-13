# Audit Report — Verbo & Hino

**Data:** 13/07/2026  
**Branch:** `chore/portfolio-quality-pass`  
**Avaliador:** revisão profissional de portfólio (arquitetura, QA, UX, segurança, DX)

---

## Resumo executivo

Verbo & Hino é um app Expo/React Native maduro para um projeto pessoal: quiz gamificado de Bíblia (ARC) e Hinário CCB, offline-first, com web na Vercel e builds Android via EAS. A lógica de domínio (pools, distratores, estatísticas) é sólida e já tinha fuzz de 24k perguntas. O maior gap para portfólio era **documentação estruturada, CI pública, README orientado a recrutador e um bug crítico de export/import no mobile** (`expo-file-system` SDK 54).

**Nota atual (após este passe):** **8.4 / 10**  
**Nota anterior estimada:** ~6.8 / 10 (produto bom, packaging de portfólio incompleto, export nativo quebrado)

---

## Principais riscos

| Severidade | Risco | Status |
|---|---|---|
| Crítico | `expo-file-system` v19: `writeAsStringAsync` / `readAsStringAsync` importados do entrypoint principal **lançam em runtime** no mobile | **Corrigido** → `expo-file-system/legacy` |
| Alto | Histórico local sem teto → risco de estourar AsyncStorage | **Corrigido** (cap 5000) |
| Médio | Sem CI → regressões silenciosas no GitHub | **Corrigido** |
| Médio | Import JSON substituía histórico sem confirmação | **Corrigido** |
| Baixo | Timer do Relógio chamava side-effect dentro de `setState` | **Corrigido** |
| Baixo | Empty states fracos na tela de estatísticas | **Corrigido** |
| Info | Sem backend/auth → superfície de ataque mínima (positivo) | OK |
| Info | Conteúdo religioso de terceiros (ARC/hinário) — respeitar direitos ao republicar datasets | Documentado |

---

## Quick wins (feitos)

1. Corrigir export/import mobile com legacy FileSystem.
2. Confirmação antes de substituir/limpar histórico.
3. Empty states e labels de acessibilidade.
4. Scripts `lint` + `ci` + GitHub Actions.
5. README de portfólio + suite `docs/`.
6. `.gitignore` e `.env.example` reforçados.
7. Garantir sempre 4 opções distintas na factory.
8. Cap de histórico.

---

## Melhorias estruturais

- Separação clara: `screens` / `components` / `utils` / `data` / `assets`.
- Contextos leves (`History`, `Theme`) em vez de state manager pesado — adequado ao escopo.
- Pools gerados em runtime com yield para não travar UI.
- Testes de domínio sem React Native real (esbuild + stubs) — barato e estável.
- Próximo passo estrutural opcional: extrair contextos de `App.js` para `src/context/` e tipar com JSDoc/TS.

---

## Bugs encontrados

1. **Export/Import Android/iOS quebrados** após upgrade Expo 54 (métodos legacy no entrypoint errado).
2. **Opções &lt; 4** possíveis em pools degenerados (agora preenchidas).
3. **Hint de faixa** do hinário dizia `321–480` (hinário vai até ~485).
4. **Tabela Top 15 vazia** sem mensagem quando não há dados.
5. **Side-effect no updater** do timer (Relógio).

---

## Plano de execução

| Fase | Ação | Resultado |
|---|---|---|
| 1 | Diagnóstico + inventário | Este relatório |
| 2 | `npm test` + `export:web` | Passou |
| 3 | Correção de bugs | exporters, factory, timer, stats UX |
| 4 | Arquitetura/DX | scripts, gitignore, env example, docs |
| 5 | UX | empty states, confirmações, a11y, touch targets |
| 6 | README portfólio | Reescrito |
| 7 | CI | `.github/workflows/ci.yml` |
| 8 | Deploy | Instruções Vercel + EAS |
| 9 | Handoff | `docs/HANDOFF.md` + commit |

---

## Checklist final

- [x] Instala (`npm install` / node_modules presente)
- [x] Testes passam (`npm test`)
- [x] Build web (`npm run export:web`)
- [x] Bugs principais corrigidos
- [x] README de portfólio
- [x] Docs de arquitetura / decisões / testes / deploy / handoff
- [x] CI GitHub Actions
- [x] `.env.example` + `.gitignore`
- [x] UX revisada (empty/confirm/a11y)
- [ ] Push remoto (executar se autorizado)
- [ ] Redeploy Vercel (manual após merge)
