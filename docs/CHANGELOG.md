# Changelog — Portfolio quality (2026-07)

## [2.0.1-portfolio] — branch `chore/portfolio-quality-pass`

### Fixed
- Export/import mobile no Expo SDK 54 (`expo-file-system/legacy`)
- Race de vidas no modo Sobrevivência
- Side-effect do timer Relógio fora do updater de `setState`
- Import circular telas → `App.js`
- Histórico sem teto (cap 5000)
- Import/limpar sem confirmação
- Opções &lt; 4 / fallback sintético sob pools reais (guards + testes)

### Added
- CI GitHub Actions (`lint` + fuzz 24k + export web)
- Docs de arquitetura, decisões, testes, deploy, security, a11y, demo
- Contextos em `src/context/AppContext.js`
- Scripts `lint`, `ci`, captura de screenshots
- Empty states e labels de acessibilidade

### Changed
- README reescrito como peça de portfólio (claims honestos)
- Dica de faixa do hinário até 485
- Ajudas (50/50, dica) resetam a cada pergunta

### Security / privacy
- Offline-first, sem telemetria obrigatória
- `docs/SECURITY_NOTES.md` — direitos de conteúdo ARC/hinário
