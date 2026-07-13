# Demo guiada (3–5 min) — Verbo & Hino

**Público:** recrutador / entrevistador (analytics engineering, dados, full-stack).  
**Demo canônica:** https://verbo-hino.vercel.app  
**Repo:** https://github.com/BarujaFe1/VerboHino

## Roteiro

| Min | Ação | O que dizer |
|---|---|---|
| 0:00–0:40 | Abrir a demo web | “App Expo offline-first: uma codebase para mobile e web. Público: estudo ativo de Bíblia ARC e Hinário CCB.” |
| 0:40–1:30 | Jogar Bíblia / Fácil / Clássico | “A pergunta vem de pools montados em runtime (~2,1k versículos + ~1,4k estrofes). Quatro opções; dificuldade por popularidade.” |
| 1:30–2:20 | Alternar Hinário + Relógio | “Mesmo motor, outro domínio. Relógio força decisão sob tempo — gamificação com feedback.” |
| 2:20–3:20 | Stats → export JSON | “Estatísticas locais (Top 5/15, acurácia). Offline = privacidade; export/import mitiga falta de sync.” |
| 3:20–4:20 | Abrir repo / `npm test` | “Fuzz de 24k perguntas com invariantes. CI no GitHub. Corrigi FileSystem no Expo 54 e removi import circular.” |
| 4:20–5:00 | Trade-offs | “Sem backend de propósito. Conteúdo embutido: MIT cobre o código, não o copyright do texto bíblico/hinário.” |

## Evidências a ter abertas

1. Demo web  
2. PR/CI verde  
3. `docs/ARCHITECTURE.md`  
4. Saída de `npm test`  

## Não diga

- “Enterprise / premium / IA”  
- “Produção em escala” (é app pessoal com demo pública)  
- Que o MIT libera redistribuir o hinário/ARC em lojas sem checar direitos
