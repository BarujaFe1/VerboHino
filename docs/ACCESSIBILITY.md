# Acessibilidade — checklist honesto

**Escopo desta revisão:** labels, estados e alvos de toque no código + inspeção web.  
**Não feito:** auditoria completa TalkBack (Android) / VoiceOver (iOS) em dispositivo físico.

## Implementado

| Área | Evidência |
|---|---|
| Alternativas | `AnswerButton` com `accessibilityLabel`, `accessibilityRole`, estado disabled |
| 50/50 | Opções eliminadas anunciadas como “Opção eliminada” |
| Header | IconButtons com labels (tema, estatísticas, reiniciar) |
| Card da pergunta | `VerseCard` com label composta + `accessibilityLiveRegion` na dica |
| Stats | Botões de export/import/limpar com labels; diálogos de confirmação |
| Toque | `minHeight` ≥ 44–48 em botões principais |

## Lacunas conhecidas (P2/P3)

- SegmentedButtons do Paper: labels padrão OK, mas contraste em tema claro merece checagem visual.
- Gráfico PieChart: legenda textual existe; não há descrição alternativa completa para leitores de tela.
- Sons: feedback sonoro só no nativo; web silencia de propósito.
- Fluxo Relógio: barra visual; não há anúncio periódico do tempo restante.

## Como completar depois

1. Android: TalkBack — percorrer Game → resposta → Stats → import cancelado.  
2. iOS: VoiceOver no mesmo caminho.  
3. Registrar achados em issue; não bloquear portfólio web.
