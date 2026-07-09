# portfolio-project-handoff.md

> Documento oficial de handoff do projeto **Verbo & Hino** para uso em portfólio profissional.
> Gerado em 08/07/2026. Autor: BarujaFe (BarujaFe1).

---

## 1. Identificação do projeto

- **Nome oficial do projeto:** Verbo & Hino
- **Tipo de projeto:** Aplicativo móvel (React Native / Expo) com versão web (PWA estática) para estudo gamificado.
- **Objetivo principal:** Transformar o estudo da **Bíblia** e do **Hinário da CCB** em uma experiência interativa, leve e desafiadora, por meio de quizzes, modos de jogo, níveis de dificuldade, histórico de desempenho e estatísticas locais.
- **Status atual:** Em produção — versão **2.0.0**, publicado na Vercel.
- **URL de produção:** https://verbo-hino.vercel.app
- **Repositório:** https://github.com/BarujaFe1/VerboHino
- **Contexto de criação:** Projeto pessoal de autoria própria, construído do zero neste ambiente, com base em dados reais (Bíblia Almeida Revista e Corrigida e hinário da Congregação Cristã no Brasil), como exercício de produto, gamificação e engenharia React Native/Expo.

---

## 2. Resumo executivo

**Verbo & Hino** é um app de quiz que apresenta um versículo ou uma estrofe de hino e desafia o usuário a identificar a referência bíblica correta (livro, capítulo e versículo) ou o hino correto (número e título). O app entrega duas modalidades de conhecimento religioso em um único produto coeso, com mecânicas de jogos, feedback imediato e acompanhamento de progresso.

- **Público-alvo:** Membros e estudantes da Congregação Cristã no Brasil (CCB), cristãos em geral e qualquer pessoa interessada em memorizar versículos e hinos de forma lúdica.
- **Principal problema resolvido:** O estudo tradicional de Bíblia e hinário costuma ser passivo e difícil de manter. O app torna o aprendizado ativo, medível e divertido.
- **Proposta de valor:** Um único app com dois tipos de conteúdo, três dificuldades, três modos de jogo, auxílios estratégicos, tema claro/escuro e estatísticas locais — tudo offline, sem necessidade de conta.
- **Por que merece entrar no portfólio:** Demonstra domínio de arquitetura React Native/Expo, geração dinâmica de conteúdo a partir de grandes bases de dados (Bíblia completa + 485 hinos), gamificação, visual moderno inspirado no estilo Apple, deploy multiplataforma (mobile + web) e práticas de qualidade (testes, build reproduzível).

---

## 3. O que foi construído

### Telas e seções
- **GameScreen (tela principal):** card central com o versículo/estrofe, seletor de tipo (Bíblia/Hinário), seletor de modo (Clássico/Sobrevivência/Relógio), seletor de dificuldade (Fácil/Médio/Difícil), pontuação, vidas (modo sobrevivência), barra de tempo (modo relógio), botões de resposta, auxílios 50/50 e Dica, e feedback de acerto/erro.
- **StatsScreen (estatísticas):** resumo de acurácia geral e por tipo, gráfico de pizza (Top 5), tabela (Top 15) por livro (Bíblia) ou hino (Hinário), e botões de exportar/importar histórico.
- **Header global:** botões de alternar tema, abrir estatísticas e reiniciar partida.

### Componentes
- `VerseCard` — card do texto (versículo/estrofe) com título, subtítulo e dica.
- `AnswerButton` — botão de alternativa com estados correto/incorreto/eliminado.
- `Hearts` — indicador de vidas (♥/♡).
- `AnswerButton`, `Hearts`, `VerseCard` reutilizáveis e tema-agnósticos.

### Fluxos e interações
- Fluxo contínuo de perguntas com transição animada (`LayoutAnimation`).
- Ao acertar: som opcional, vibração (haptic), incremento de pontos, streak e multiplicador x2 após 3 acertos seguidos.
- Ao errar: som, vibração, perda de vida (sobrevivência) ou fim de tempo (relógio).
- Histórico persistido localmente (AsyncStorage / localStorage no web) e refletido nas estatísticas.

### Responsividade e estados visuais
- Layout vertical com `ScrollView`, `SafeAreaView` e espaçamentos consistentes.
- Tema claro/escuro automático (segundo o sistema) ou manual, via contexto `ThemeModeContext`.
- Paletas dedicadas (light "estilo Apple" e dark "Dracula adaptado") com bordas arredondadas, sombras suaves e hierarquia visual clara.

### Navegação
- `NavigationContainer` + `createNativeStackNavigator` com duas telas: `Game` e `Stats`.

### Integrações e regras de negócio
- **Bíblia:** versículo → escolher a referência (Livro cap:verso).
- **Hinário:** estrofe → escolher o hino (Nº — Título).
- Dificuldades balanceadas por popularidade (`common_passages.json`, `common_hymns.json`) via tiers easy/medium/hard.
- Distratores inteligentes: no modo difícil, prefere mesmo livro/testamento (Bíblia) ou títulos parecidos (Hinário).
- Auxílios: 50/50 remove duas alternativas incorretas; Dica mostra o testamento (Bíblia) ou faixa de numeração (Hinário).

### Diferenciais
- Conteúdo real e extenso (Bíblia ARC completa com 66 livros; 485 hinos com estrofes).
- Funciona 100% offline (sem backend, sem login).
- Uma única base de código Expo gera app mobile **e** site web.

---

## 4. Como foi construído

### Arquitetura geral
Aplicação Expo (Managed Workflow) com `App.js` na raiz como ponto de entrada. Dois contextos React provêm estado global: `HistoryContext` (histórico de partidas) e `ThemeModeContext` (tema). A navegação é controlada por React Navigation; a interface usa React Native Paper (MD3).

### Stack
- **Expo 54**, **React Native 0.81**, **React 19**.
- **React Navigation 7** (native-stack), **React Native Paper 5** (UI), **AsyncStorage 2**.
- **react-native-chart-kit** (gráficos), **react-native-svg** (ícones/vetores), **react-native-gesture-handler**.
- **Expo AV** (som), **Expo Haptics** (vibração), **Expo Sharing** / **Expo FileSystem** / **Expo Document Picker** (export/import).
- **Vercel** para hospedagem web; `expo export --platform web` gera um bundle estático.

### Organização do código
```
App.js                      # entry: providers, navegação, contextos
src/
  theme.js                  # paletas claro/escuro + temas Paper/Nav
  data/rawList.js           # lista bruta de referências bíblicas (426)
  screens/
    GameScreen.js           # lógica principal do jogo
    StatsScreen.js          # estatísticas e exportação
  components/
    VerseCard.js
    AnswerButton.js
    Hearts.js
  utils/
    dataLoader.js           # montagem dos pools (Bíblia/Hinário)
    questionFactory.js      # criação de perguntas + distratores
    difficulty.js           # tiers por popularidade
    statistics.js           # histórico e agregações
    exporters.js            # export/import JSON e CSV
    preferences.js          # tema persistido
    sound.js                # áudio (expo-av) com fallback web
    asyncStorage.js         # ponte para AsyncStorage/shim web
    web/asyncStorageShim.js # implementação localStorage para web
assets/
  arc.json                  # Bíblia ARC (3,9 MB, 66 livros)
  hinario_pronto.json       # 485 hinos com estrofes
  common_passages.json      # 426 passagens populares (count)
  common_hymns.json         # mapa numero->popularidade
  audio/                    # correct.mp3, wrong.mp3
```

### Estratégia de UI/UX e decisões de design
- Estética "Apple-like": cantos arredondados (roundness 18), cartões claros, tipografia pesada (fontWeight 800/900), microanimações.
- Cor primária roxa (purple) e secundária ciano, com verde/vermelho para feedback.
- Tema automático + manual; respeita `userInterfaceStyle` do Expo.

### Tratamento de estado
- Estado de jogo local em `GameScreen` (score, streak, multiplier, lives, helps, timer).
- Histórico e tema em contextos globais, persistidos via AsyncStorage/localStorage.
- Efeitos (`useEffect`) cuidam de carregamento de dados, reset por mudança de configuração, timer do modo relógio e UI reativa.

### Consumo e geração de conteúdo
- Pools gerados em runtime a partir de `assets/arc.json` (todas as estrofes válidas, filtradas por tamanho e heurística anti-genealogia) + `hinario_pronto.json` (estrofes ≥ 40 caracteres).
- `questionFactory` monta 4 opções distintas com distratores por dificuldade e garante terminação (conjuntos distintos).

### Critérios técnicos
- Build web reproduzível: `vercel.json` define `buildCommand: npx expo export --platform web`, `outputDirectory: dist`, rewrite SPA e cache imutável de assets estáticos.
- Testes: `npm test` executa fuzz de 24.000 perguntas (invariantes de opções) + validação de estatísticas/exportação, com stubs para módulos nativos.

---

## 5. Onde foi construído e publicado

- **Ambiente de desenvolvimento:** Windows com Node.js 22, Expo CLI, Visual Studio Code; código versionado em Git.
- **Hospedagem:** **Vercel** (produção), projeto `verbo-hino` (`prj_vuqrux3QrRAZCIcDtiUigASjW7cv`), sob um time Vercel (`orgId: team_Dj88L2uetUzQOe8nAbXT8lJX`).
- **URL exata de produção:** https://verbo-hino.vercel.app
- **Observações de build/deploy:** O site é gerado por `expo export --platform web` (bundle estático em `dist/`) e servido pela Vercel. Não há backend; todo o estado é local. Para Android, usa-se EAS Build (`eas build --profile preview --platform android`) com `applicationId` `com.barujafe.verbohino`.
- **Status verificado em 08/07/2026:** URL respondeu HTTP 200 (site ativo).

---

## 6. Funcionalidades principais

1. **Quiz Bíblia** — exibe versículo e pede a referência correta (Livro cap:verso).
2. **Quiz Hinário** — exibe estrofe e pede o hino correto (Nº — Título).
3. **Dificuldades (Fácil/Médio/Difícil)** — balanceadas por popularidade dos versículos/hinos.
4. **Modos de jogo:** Clássico (fluxo livre), Sobrevivência (3 vidas), Relógio (tempo por pergunta).
5. **Streak e multiplicador x2** — recompensa sequências de acertos.
6. **Auxílios 50/50 e Dica** — estratégias de apoio durante a partida.
7. **Tema claro/escuro** — automático ou manual, com paletas dedicadas.
8. **Feedback tátil e sonoro** — haptics e áudios de acerto/erro (opcionais).
9. **Estatísticas locais** — gráfico Top 5, tabela Top 15, acurácia geral/por tipo.
10. **Exportar/Importar histórico** — JSON e CSV (compartilhamento/backup local).

---

## 7. Fluxo de uso

1. Abrir o app (web ou mobile) — tela inicial "QUAL É?".
2. Escolher tipo (Bíblia/Hinário), modo e dificuldade.
3. Responder às perguntas tocando na alternativa; receber feedback imediato (cor/som/vibração).
4. Acompanhar pontuação, streak e vidas/tempo conforme o modo.
5. Usar 50/50 ou Dica quando necessário (uma vez cada por pergunta).
6. Ao fim (sobrevivência) ou a qualquer momento, abrir Estatísticas para ver desempenho.
7. Exportar histórico em JSON/CSV ou importar para restaurar/comparar.

---

## 8. Stack técnica

- **Frontend / Mobile:** React Native 0.81, React 19, Expo 54 (Managed Workflow).
- **Navegação:** React Navigation 7 (native-stack).
- **UI / Styling:** React Native Paper 5 (MD3), StyleSheet nativo, react-native-svg.
- **Gráficos:** react-native-chart-kit.
- **Estado/Armazenamento local:** AsyncStorage 2 (+ shim localStorage para web), Context API.
- **Áudio / Haptics:** Expo AV, Expo Haptics.
- **Export/Import:** Expo Sharing, Expo FileSystem, Expo Document Picker.
- **Hospedagem web:** Vercel (static, SPA).
- **Build web:** `expo export --platform web`.
- **Mobile build:** EAS Build (APK/AAB), Android `applicationId` `com.barujafe.verbohino`.
- **Qualidade:** testes automatizados (`npm test`) com esbuild + Node.
- **Linguagem:** JavaScript (ESM).

---

## 9. Decisões de produto e design

- **Um app, dois conteúdos:** evita fragmentação e aumenta o valor de uso com esforço concentrado.
- **Sem backend / sem login:** reduz atrito, protege privacidade e simplifica deploy (100% estático).
- **Popularidade como critério de dificuldade:** versículos/hinos comuns caem em "Fácil", raros em "Difícil", tornando o desafio progressivo e justo.
- **Visual Apple-like:** familiar, limpo e profissional, favorecendo percepção de qualidade no portfólio.
- **Multiplataforma a partir do mesmo código:** demonstra eficiência e domínio do ecossistema Expo.

---

## 10. Diferenciais para portfólio

- **Competências demonstradas:** arquitetura React Native/Expo, geração dinâmica de UI a partir de grandes datasets, gamificação, temas, testes e deploy.
- **Complexidade:** lógica de distratores por dificuldade, pools de milhares de itens, exportação de dados, build web a partir de app mobile.
- **Maturidade técnica:** testes de fuzz, build reproduzível, tratamento de web (shim de storage), correção de bugs encontrados em teste.
- **Valor visual:** identidade coesa, tema duplo, microanimações.
- **Valor de produto:** app real, utilizável e com propósito claro.
- **Relevância:** portfólio de autor com domínio de conteúdo religioso e técnica moderna — diferencial para recrutadores e clientes.

---

## 11. Limitações atuais

- O `git push` para o repositório GitHub não foi executado nesta sessão (bloqueado por regra de segurança do ambiente); o código está commitado localmente e pronto para envio.
- A versão em ar na Vercel reflete o estado do projeto vinculado; as correções mais recentes desta sessão (commit `66d7a16`) precisam de um novo deploy/redeploy para aparecerem online.
- Conteúdo do Hinário restrito ao dataset `hinario_pronto.json` fornecido.
- Sem sincronização em nuvem (histórico é local por dispositivo).
- `common_passages.json` possui 3 entradas malformadas (sem capítulo) que são ignoradas graciosamente.

---

## 12. Próximos passos possíveis

- Redeploy na Vercel para publicar as correções do commit `66d7a16`.
- `git push origin HEAD` para sincronizar o repositório GitHub.
- Adicionar modo "versículo → livro" e "hino → autor/compositor".
- Sincronização opcional do histórico (iCloud/Google) ou exportação ampla.
- Acessibilidade: suporte a VoiceOver/TalkBack e fontes ajustáveis.
- Versão iOS via EAS Build.

---

## 13. Metadados prontos para portfólio

- **Nome do projeto:** Verbo & Hino
- **Subtítulo:** Gamificando o aprendizado cristão (Bíblia e Hinário da CCB)
- **Descrição curta:** App de quiz gamificado para estudar a Bíblia e o Hinário da CCB.
- **Descrição média:** Quiz interativo com versículos bíblicos e estrofes de hinos, três dificuldades, três modos de jogo, estatísticas locais e tema claro/escuro.
- **Descrição longa:** Verbo & Hino é um aplicativo React Native/Expo que transforma o estudo da Bíblia e do Hinário da Congregação Cristã no Brasil em um jogo de perguntas e respostas. O usuário escolhe entre Bíblia (identificar a referência de um versículo) e Hinário (identificar o hino de uma estrofe), com níveis Fácil/Médio/Difícil e modos Clássico, Sobrevivência e Relógio. Inclui streak, multiplicador, auxílios 50/50 e dica, feedback tátil e sonoro, tema claro/escuro e um painel de estatísticas com gráfico Top 5 e tabela Top 15, além de exportação/importação do histórico em JSON e CSV. Tudo funciona offline, sem conta, com a mesma base de código gerando também um site web publicado na Vercel.
- **Lista de tecnologias:** React Native, Expo, React Navigation, React Native Paper, AsyncStorage, react-native-chart-kit, Expo AV, Expo Haptics, Expo Sharing/FileSystem/Document Picker, Vercel, JavaScript.
- **Categoria:** Mobile App / Educação / Gamificação.
- **Status:** Em produção (v2.0.0).
- **Link de demo:** https://verbo-hino.vercel.app
- **Link de repositório:** https://github.com/BarujaFe1/VerboHino
- **Destaque principal:** Gamificação de estudo bíblico e hinário com quiz, estatísticas e temas — uma base Expo servindo mobile e web.
- **Bullets de impacto:**
  - 2 tipos de quiz (Bíblia e Hinário) com 3 dificuldades e 3 modos de jogo.
  - Estatísticas locais com gráfico Top 5, tabela Top 15 e exportação JSON/CSV.
  - Tema claro/escuro, feedback tátil e sonoro, e auxílios 50/50 e dica.
  - Deploy web na Vercel a partir do mesmo código Expo (uma base, múltiplas plataformas).
- **Tags:** React Native, Expo, Quiz, Gamificação, Bíblia, Hinário, Educação, Vercel.

---

## 14. Sugestão de card para portfólio

> **Verbo & Hino**
> Gamificando o aprendizado cristão — quiz de Bíblia e Hinário da CCB.
> *React Native · Expo · Vercel*
> [Demo] https://verbo-hino.vercel.app  ·  [GitHub] https://github.com/BarujaFe1/VerboHino

---

## 15. Sugestão de texto para página/case study

**Verbo & Hino — quando o estudo vira jogo**

Verbo & Hino nasceu da vontade de tornar o estudo da Bíblia e do Hinário da CCB mais leve, ativo e prazeroso. Em vez de ler passivamente, o usuário encara desafios: um versículo aparece e ele deve deduzir a referência; uma estrofe de hino aparece e ele deve reconhecer o número e o título.

Por trás da simplicidade visual está uma engenharia cuidadosa: pools gerados em runtime a partir de uma Bíblia completa (66 livros) e de 485 hinos, distratores inteligentes que respeitam a dificuldade, e um sistema de progressão com streak e multiplicador. Tudo funciona offline, com histórico local e estatísticas exportáveis.

A mesma base Expo gera o app mobile e o site publicado na Vercel — prova de eficiência e domínio de deploy multiplataforma. É, ao mesmo tempo, um produto útil e uma demonstração concreta de competência em React Native, gamificação e entrega de software.
