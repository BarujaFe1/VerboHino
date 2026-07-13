# Security & Privacy Notes — Verbo & Hino

**Última revisão:** 13/07/2026  
**Branch:** `chore/portfolio-quality-pass`

## Resumo

Este app é **offline-first**, sem backend, sem login e sem telemetria obrigatória. A superfície de ataque é pequena. Nenhum segredo de API, token ou `.env` com credenciais foi encontrado no código-fonte nesta revisão.

## Achados

| Item | Severidade | Status |
|---|---|---|
| Credenciais / tokens no repo | — | **Nenhum encontrado** |
| `.env` commitado | — | **Não** (protegido no `.gitignore`; existe só `.env.example` sem segredos) |
| Dados pessoais de usuários | Baixo | Histórico fica no dispositivo (AsyncStorage / localStorage) |
| XSS / HTML injection | Baixo | Conteúdo vem de JSON estático; UI React Native (sem `dangerouslySetInnerHTML`) |
| Dependências nativas de FS | Info | Export/import usa `expo-file-system/legacy` + DocumentPicker / Blob |

## Privacidade

- Progresso e estatísticas **não saem do dispositivo**, salvo se o usuário exportar JSON/CSV.
- Importação **substitui** o histórico local (com confirmação na UI).
- Não há analytics, crash reporting nem cookies de tracking no build web atual.

## Conteúdo (direitos)

Os datasets em `assets/` incluem texto bíblico (tradução ARC) e hinário CCB para uso educacional/pessoal do app.

- Ao publicar em lojas ou redistribuir datasets, **verifique direitos autorais** e termos da congregação / editora.
- Este repositório trata o conteúdo como material de estudo embutido; a licença MIT do **código** não implica licença livre do conteúdo bíblico/hinário.

## Recomendações

1. Nunca commitar `.env`, keystores, tokens EAS/Vercel ou exports de histórico reais.
2. Se adicionar analytics ou sync, documentar variáveis em `.env.example` e revisar esta nota.
3. Manter o build web sem injeção de scripts de terceiros sem avaliação de privacidade.

## Contato

Reportes de segurança: abrir issue privada ou contactar o maintainer via GitHub ([BarujaFe1](https://github.com/BarujaFe1)).
