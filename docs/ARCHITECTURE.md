# Architecture — Verbo & Hino

## Visão geral

Aplicação **Expo Managed Workflow** (SDK 54) com uma base de código para:

- **Android / iOS** (Expo Go ou EAS Build)
- **Web estática** (`expo export --platform web` → Vercel)

Não há backend. Estado e progresso vivem no dispositivo (AsyncStorage / localStorage).

```txt
┌─────────────────────────────────────────────┐
│ App.js                                      │
│  SafeAreaProvider + providers               │
│  src/context/AppContext (History + Theme)   │
│  PaperProvider + NavigationContainer        │
└───────────────┬─────────────────────────────┘
                │
     ┌──────────┴──────────┐
     ▼                     ▼
 GameScreen            StatsScreen
     │                     │
     ├─ VerseCard          ├─ PieChart / DataTable
     ├─ AnswerButton       └─ exporters (JSON/CSV)
     └─ Hearts
                │
                ▼
     utils: dataLoader → questionFactory
            statistics ← AsyncStorage
            sound / preferences / difficulty
                │
                ▼
     assets: arc.json, hinario_pronto.json,
             common_passages/hymns, audio
```

## Camadas

| Camada | Responsabilidade | Onde |
|---|---|---|
| UI | Telas, feedback, navegação | `src/screens`, `src/components` |
| App state | Histórico + tema (contexts) | `src/context/AppContext.js` |
| Domínio | Perguntas, distratores, tiers | `questionFactory`, `difficulty`, `dataLoader` |
| Persistência | Histórico e tema | `statistics`, `preferences`, `asyncStorage` |
| I/O | Export/import arquivos | `exporters` |
| Conteúdo | Bíblia ARC + hinário | `assets/*.json`, `src/data/rawList.js` |

## Fluxo de uma pergunta

1. `GameScreen` carrega JSON e chama `buildAllPoolsAsync`.
2. Pool da Bíblia = lista popular (`rawList`) + amostra extra do ARC.
3. Pool do Hinário = estrofes ≥ 40 caracteres, com popularidade.
4. `tierByPopularity` divide easy/medium/hard.
5. `createQuestion` escolhe item do tier, monta 4 opções e hint.
6. Resposta → feedback (som/haptic) → `addRecord` no histórico.

## Persistência

- Chave histórico: `@quiz_history_v2`
- Chave tema: `@quiz_theme_mode_v1`
- Cap: 5000 registros (mais antigos descartados)
- Web: shim `localStorage` com prefixo `@vh:`

## Multiplataforma

| Capacidade | Mobile | Web |
|---|---|---|
| Quiz / modos | Sim | Sim |
| Haptics / AV | Sim | Degradado (som skip) |
| Export JSON/CSV | Share sheet | Download Blob |
| Import JSON | DocumentPicker | `<input type=file>` |
| Storage | AsyncStorage | localStorage shim |

## Decisão de não ter backend

Privacidade, zero custo operacional, deploy estático e foco no domínio do quiz. Trade-off: sem sync entre dispositivos (mitigado por export/import).
