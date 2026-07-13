<div align="center">
  <img src="./assets/icon.png" alt="Verbo & Hino Logo" width="120" height="120" />

  <h1>Verbo & Hino</h1>
  <p><strong>Gamificando o aprendizado cristão</strong> — quiz offline de Bíblia (ARC) e Hinário da CCB.</p>
  <p><em>Christian learning, gamified — offline Bible & CCB hymnal quizzes.</em></p>

  <p>
    <a href="https://verbo-hino.vercel.app"><img src="https://img.shields.io/badge/demo-web-success" alt="Demo web" /></a>
    <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="Version" />
    <img src="https://img.shields.io/badge/Expo-54-000020.svg?logo=expo" alt="Expo" />
    <img src="https://img.shields.io/badge/React%20Native-0.81-61DAFB.svg?logo=react" alt="RN" />
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT" />
  </p>

  <p>
    <a href="https://verbo-hino.vercel.app">Demo ao vivo</a> ·
    <a href="#pt-br">Português</a> ·
    <a href="#english">English</a> ·
    <a href="./docs/ARCHITECTURE.md">Arquitetura</a>
  </p>
</div>

---

## Preview / Screenshot

> Placeholder de captura — substitua por screenshot real do app (mobile ou web).

<p align="center">
  <img src="./assets/icon.png" alt="Screenshot placeholder — Verbo & Hino" width="200" />
</p>

Live: **[verbo-hino.vercel.app](https://verbo-hino.vercel.app)**

---

<a id="pt-br"></a>

## O problema real

Estudar Bíblia e hinário costuma ser **passivo**: ler, sublinhar, esquecer. Membros e jovens da CCB (e cristãos em geral) precisam de uma forma **ativa, mensurável e divertida** de memorizar referências e hinos — sem criar conta, sem internet obrigatória e sem complexidade.

## A solução

**Verbo & Hino** transforma estudo em jogo:

- Mostra um **versículo** → você escolhe a referência correta.
- Mostra uma **estrofe** → você escolhe o hino (número + título).
- Três dificuldades, três modos, streak, ajudas, estatísticas locais e tema claro/escuro.
- Uma base **Expo** gera **mobile + web**.

## Principais funcionalidades

| Área | O que entrega |
|---|---|
| Quiz Bíblia | Versículo → referência (livro cap:verso) |
| Quiz Hinário | Estrofe → Nº + título |
| Dificuldade | Fácil / Médio / Difícil por popularidade |
| Modos | Clássico · Sobrevivência (3 vidas) · Relógio |
| Progressão | Pontos, streak, multiplicador x2 |
| Ajudas | 50/50 e dica (testamento / faixa numérica) |
| Stats | Top 5, Top 15, acurácia, export JSON/CSV, import com confirmação |
| UX | Tema claro/escuro, haptics, sons, empty states |

## Arquitetura (resumo)

```txt
App.js (Contextos + Navigation)
  ├─ GameScreen  → dataLoader → questionFactory
  └─ StatsScreen → statistics + exporters
assets/ (ARC + hinário + popularidade + áudio)
```

Detalhes: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)

## Stack

- Expo 54 · React Native 0.81 · React 19
- React Navigation 7 · React Native Paper 5
- AsyncStorage · Chart Kit · Expo AV / Haptics / Sharing / FileSystem / DocumentPicker
- Vercel (web estática) · EAS Build (Android)

## Demo local

```bash
git clone https://github.com/BarujaFe1/VerboHino.git
cd VerboHino
npm install
npm start          # Expo Dev Tools
npm run web        # browser
```

Requisitos: **Node.js LTS (22+)**.

## Comandos úteis

| Comando | Função |
|---|---|
| `npm start` | Dev server Expo |
| `npm run web` | Web local |
| `npm test` | Fuzz + stats/export |
| `npm run lint` | Checagens estruturais |
| `npm run export:web` | Bundle estático em `dist/` |
| `npm run ci` | lint + test + export |
| `npm run eas:preview` | APK preview (EAS) |

## Variáveis de ambiente

Nenhuma obrigatória. O app é offline-first. Veja [`.env.example`](./.env.example).

## Testes

```bash
npm test
```

- ~24k perguntas geradas com invariantes (4 opções únicas, hint, label correta).
- Stats, cap de histórico, sanitize de import, CSV/JSON.

Mais: [`docs/TESTING.md`](./docs/TESTING.md)

## Decisões técnicas e trade-offs

- **Sem backend** → privacidade e simplicidade; sem sync na nuvem.
- **JS + testes de domínio** → entrega rápida; tipagem estática fica no roadmap.
- **`expo-file-system/legacy`** → compatível com SDK 54 sem reescrever I/O.
- **Dificuldade por popularidade** → justo para o público; não é exegese.

Ver [`docs/TECHNICAL_DECISIONS.md`](./docs/TECHNICAL_DECISIONS.md).

## Roadmap

- [ ] Screenshots reais no README / store
- [ ] Acessibilidade avançada (TalkBack/VoiceOver audit)
- [ ] Modo “versículo → livro” e “hino → compositor”
- [ ] Sync opcional / backup em nuvem
- [ ] Build iOS via EAS
- [ ] Migração gradual para TypeScript nos utils

## Status atual

**Produção web v2.0.0** · lógica de domínio estável · CI configurada · export mobile corrigido no SDK 54.

## O que este projeto demonstra

- Produto completo (não só UI): conteúdo grande, regras de jogo, persistência, export.
- Engenharia Expo multiplataforma (mobile + web estático).
- Gamificação com feedback sensorial e métricas locais.
- Qualidade: fuzz tests, CI, docs de arquitetura e handoff.
- Sensibilidade a privacidade (offline, sem tracking obrigatório).

## Como eu apresentaria em entrevista

1. **Problema:** estudo passivo → retenção baixa.  
2. **Produto:** quiz dual (Bíblia + Hinário) com modos e dificuldade por popularidade.  
3. **Engenharia:** pools em runtime a partir de ARC completo + 485 hinos; distratores por dificuldade.  
4. **Entrega:** mesma codebase na Vercel e no Android (EAS).  
5. **Qualidade:** mostro `npm test` (24k perguntas) e o bug do FileSystem no SDK 54 que corrigi.  
6. **Trade-off consciente:** offline-first vs. sync — e como export/import mitiga.

---

<a id="english"></a>

## English (short)

**Verbo & Hino** is an offline-first Expo app that gamifies Christian learning: identify Bible references from verses and CCB hymns from stanzas. It ships Classic / Survival / Time Attack modes, difficulty tiers, assists, local stats with JSON/CSV export, and a static web build on Vercel.

```bash
npm install && npm start
npm test && npm run export:web
```

Live demo: https://verbo-hino.vercel.app

---

## Docs

| Doc | Conteúdo |
|---|---|
| [`docs/AUDIT_REPORT.md`](./docs/AUDIT_REPORT.md) | Auditoria e nota |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Arquitetura |
| [`docs/TECHNICAL_DECISIONS.md`](./docs/TECHNICAL_DECISIONS.md) | ADRs / trade-offs |
| [`docs/TESTING.md`](./docs/TESTING.md) | Estratégia de testes |
| [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) | Vercel + EAS |
| [`docs/HANDOFF.md`](./docs/HANDOFF.md) | Handoff da revisão |

## Autor

**Felipe Alirio Baruja (BarujaFe)**  
[GitHub](https://github.com/BarujaFe1) · [LinkedIn](https://linkedin.com/in/barujafe) · [Portfólio](https://barujafe.vercel.app/)

## License

MIT — see [`LICENSE`](./LICENSE).
