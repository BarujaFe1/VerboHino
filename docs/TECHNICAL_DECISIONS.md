# Technical Decisions — Verbo & Hino

## 1. Expo Managed + React Native Paper

**Decisão:** Expo SDK 54 + Paper (MD3) + React Navigation native-stack.  
**Por quê:** velocidade de entrega, temas consistentes, build web incluso.  
**Trade-off:** menos controle nativo fino; dependência do ciclo do Expo.

## 2. JavaScript (sem TypeScript)

**Decisão:** manter JS puro com testes de invariantes.  
**Por quê:** código já estabelecido; custo de migração alto vs. valor imediato de portfólio.  
**Trade-off:** menos segurança estática. Mitigação: fuzz tests + `scripts/lint.mjs`.  
**Roadmap:** JSDoc tipado ou migração gradual para TS nos utils.

## 3. Offline-first sem conta

**Decisão:** zero auth/backend.  
**Por quê:** reduz atrito (público religioso / estudo pessoal), protege privacidade.  
**Trade-off:** sem ranking global nem sync. Mitigação: export/import JSON/CSV.

## 4. Dificuldade por popularidade

**Decisão:** tercis de popularidade (`common_passages` / `common_hymns`).  
**Por quê:** “fácil” = o que a comunidade mais cita; “difícil” = menos familiar.  
**Trade-off:** popularidade ≠ dificuldade teológica absoluta.

## 5. Distratores inteligentes

**Decisão:** hard mode favorece mesmo livro/testamento (Bíblia) ou títulos parecidos (Hinário).  
**Por quê:** evita alternativas óbvias e aumenta valor pedagógico.  
**Trade-off:** implementação heurística; coberta por fuzz.

## 6. FileSystem legacy no SDK 54

**Decisão:** `import * as FileSystem from 'expo-file-system/legacy'`.  
**Por quê:** entrypoint principal lança erro em runtime nos métodos antigos.  
**Alternativa futura:** API `File` / `Paths` nativa do SDK 54.

## 7. Testes com esbuild + stubs

**Decisão:** bundle Node dos utils de domínio, sem Jest/Detox.  
**Por quê:** CI rápido, sem emulador, foca na lógica que mais quebra.  
**Trade-off:** sem testes de UI/E2E. Aceitável no estágio atual.

## 8. Tema dark-first

**Decisão:** default `dark` (Dracula adaptado) + light Apple-like.  
**Por quê:** identidade visual forte no portfólio e no web header.  
**Trade-off:** não segue automaticamente o sistema até o usuário persistir preferência.

## 9. Cap de histórico em 5000

**Decisão:** truncar registros mais antigos.  
**Por quê:** AsyncStorage/localStorage têm limites práticos.  
**Trade-off:** perda de histórico muito antigo; export recomendado.
