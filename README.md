<div align="center">
  <img src="./assets/icon.png" alt="Verbo & Hino Logo" width="120" height="120" />

  <h1>Verbo & Hino</h1>

  <p>
    <strong>Gamificando o aprendizado cristão</strong><br />
    <em>Gamifying Christian learning</em>
  </p>

  <p>
    <a href="#pt-br">🇧🇷 Português</a> •
    <a href="#english">🇺🇸 English</a> •
    <a href="#downloads">Downloads</a> •
    <a href="#license--licença">License / Licença</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="Version 2.0.0" />
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License MIT" />
    <img src="https://img.shields.io/badge/Expo-54.0.0-000020.svg?logo=expo" alt="Expo" />
    <img src="https://img.shields.io/badge/React%20Native-0.81-61DAFB.svg?logo=react" alt="React Native" />
  </p>
</div>

---

<a id="pt-br"></a>

# 🇧🇷 Português

## 📖 Sobre o projeto

**Verbo & Hino** é um aplicativo mobile criado para transformar o estudo da **Bíblia** e do **Hinário da CCB** em uma experiência interativa, leve e desafiadora.

A proposta do app é unir aprendizado cristão, gamificação e uma interface moderna inspirada no estilo Apple, oferecendo quizzes, modos de jogo, níveis de dificuldade, histórico de desempenho e estatísticas locais para acompanhar a evolução do usuário.

> “Conhecereis a verdade, e a verdade vos libertará.” — João 8:32

---

## ✨ Funcionalidades

### 🎮 Tipos de quiz

- **Bíblia:** o app exibe um versículo e o jogador deve escolher a referência correta.
- **Hinário:** o app exibe uma estrofe e o jogador deve identificar o número e o título do hino correspondente.

### 🧠 Níveis de dificuldade

- **Fácil**
- **Médio**
- **Difícil**

Os níveis são balanceados com base na popularidade e recorrência dos versículos e hinos.

### 🕹️ Modos de jogo

- **Clássico:** fluxo contínuo para treino livre.
- **Sobrevivência:** o jogador começa com 3 vidas; cada erro reduz uma vida.
- **Relógio / Time Attack:** cada pergunta possui tempo limitado; tempo esgotado conta como erro.

### 🔥 Mecânicas especiais

- Pontuação por acerto.
- Sistema de **streak** para sequência de respostas corretas.
- **Multiplicador x2** após boa sequência de acertos.
- Ajudas estratégicas:
  - **50/50:** remove duas alternativas incorretas.
  - **Dica:** mostra o testamento, no quiz bíblico, ou a faixa de numeração, no quiz do hinário.

### 📊 Estatísticas e histórico

- Histórico local com resultados por tipo, modo, dificuldade, acerto/erro e data.
- Gráfico dos **Top 5** resultados.
- Tabela dos **Top 15** resultados.
- Separação entre estatísticas da Bíblia e do Hinário.
- Exportação do histórico em **JSON** e **CSV**.
- Importação de histórico para restaurar ou mesclar dados.

### 🎨 Experiência do usuário

- Interface moderna, minimalista e limpa.
- Cards arredondados, boa hierarquia visual e espaçamento confortável.
- Tema claro/escuro automático ou manual.
- Animações sutis.
- Feedback tátil em acertos e erros.
- Sons opcionais para respostas corretas e incorretas.

---

## 🚀 Tecnologias utilizadas

- [Expo Managed Workflow](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)
- [React Native SVG](https://github.com/react-native-svg/react-native-svg)
- [Expo AV](https://docs.expo.dev/versions/latest/sdk/av/)
- [Expo Sharing](https://docs.expo.dev/versions/latest/sdk/sharing/)
- [Expo FileSystem](https://docs.expo.dev/versions/latest/sdk/filesystem/)
- [Expo DocumentPicker](https://docs.expo.dev/versions/latest/sdk/document-picker/)

---

## 📁 Estrutura de pastas

```txt
Verbo-Hino/
├── assets/
│   ├── arc.json
│   ├── hinario_pronto.json
│   ├── common_passages.json
│   ├── common_hymns.json
│   ├── icon.png
│   ├── splash.png
│   └── audio/
│       ├── correct.mp3
│       └── wrong.mp3
├── src/
│   ├── components/
│   │   ├── AnswerButton.js
│   │   ├── Hearts.js
│   │   └── VerseCard.js
│   ├── screens/
│   │   ├── GameScreen.js
│   │   └── StatsScreen.js
│   ├── utils/
│   │   ├── asyncStorage.js
│   │   ├── dataLoader.js
│   │   ├── difficulty.js
│   │   ├── exporters.js
│   │   ├── preferences.js
│   │   ├── questionFactory.js
│   │   ├── sound.js
│   │   └── statistics.js
│   ├── data/
│   │   └── rawList.js
│   ├── theme.js
│   └── web/
│       └── asyncStorageShim.js
├── public/
│   └── index.html
├── android/
├── App.js
├── app.json
├── package.json
├── vercel.json
└── README.md
```

---

## 📲 Instalação direta via APK

A forma mais simples de testar o **Verbo & Hino** é instalar o APK diretamente em um dispositivo Android.

1. Baixe o APK na seção [Downloads](#downloads).
2. No Android, permita a instalação de apps de fontes desconhecidas, caso necessário.
3. Abra o arquivo baixado.
4. Toque em **Instalar**.
5. Abra o app e comece a jogar.

> 💡 O link do APK pode ser atualizado conforme novas versões forem publicadas.

---

## ⚙️ Como executar o projeto

### Pré-requisitos

- Node.js em versão LTS.
- Expo CLI instalado globalmente ou uso via `npx`.
- Dispositivo físico com Expo Go ou emulador Android/iOS configurado.

### Passo a passo

Clone o repositório:

```bash
git clone https://github.com/BarujaFe1/VerboHino.git
cd VerboHino
```

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
npm start
```

Ou, se preferir:

```bash
npx expo start
```

Depois disso, escaneie o QR Code com o **Expo Go** ou abra o app em um emulador.

---

## 📦 Build e publicação

### Gerar APK Android para testes

Instale o EAS CLI:

```bash
npm install -g eas-cli
```

Configure o projeto:

```bash
eas build:configure
```

Gere um APK de prévia:

```bash
eas build --profile preview --platform android
```

### Gerar AAB para Play Store

```bash
eas build --profile production --platform android
```

O arquivo final ficará disponível no painel do Expo ou por meio do link gerado ao final do build.

---

<a id="downloads"></a>

## 📥 Downloads

- **Web (produção):** [https://verbo-hino.vercel.app](https://verbo-hino.vercel.app)
- **APK:** gere localmente com `eas build --profile preview --platform android` (EAS projectId em `app.json`)
- **Slide de apresentação:** [Ver PDF](./assets/slide.pdf) (se disponível)

> Atualize estes links sempre que uma nova versão for publicada.

---

## 🤝 Contribuição

Contribuições são bem-vindas.

1. Faça um fork do projeto.
2. Crie uma branch para sua alteração:

```bash
git checkout -b feature/nova-feature
```

3. Faça o commit:

```bash
git commit -m "Adiciona nova feature"
```

4. Envie para o GitHub:

```bash
git push origin feature/nova-feature
```

5. Abra um Pull Request.

---

## 👨‍💻 Autor

Desenvolvido por **BarujaFe**

[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github)](https://github.com/BarujaFe1)
[![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/barujafe)

---

<a id="english"></a>

# 🇺🇸 English

## 📖 About the project

**Verbo & Hino** is a mobile app designed to turn the study of the **Bible** and the **CCB Hymnal** into an interactive, simple and challenging experience.

The app combines Christian learning, gamification and a modern Apple-inspired interface, offering quizzes, game modes, difficulty levels, local performance history and statistics to help users track their progress.

> “And ye shall know the truth, and the truth shall make you free.” — John 8:32

---

## ✨ Features

### 🎮 Quiz types

- **Bible:** the app displays a verse and the player must choose the correct reference.
- **Hymnal:** the app displays a hymn excerpt and the player must identify the correct hymn number and title.

### 🧠 Difficulty levels

- **Easy**
- **Medium**
- **Hard**

Difficulty levels are balanced according to the popularity and recurrence of Bible verses and hymns.

### 🕹️ Game modes

- **Classic:** continuous flow for free practice.
- **Survival:** the player starts with 3 lives; each mistake removes one life.
- **Time Attack:** each question has a time limit; running out of time counts as a wrong answer.

### 🔥 Special mechanics

- Score system based on correct answers.
- **Streak** system for consecutive correct answers.
- **x2 multiplier** after a strong sequence of correct answers.
- Strategic assists:
  - **50/50:** removes two incorrect alternatives.
  - **Hint:** shows the testament in Bible mode or the hymn number range in Hymnal mode.

### 📊 Statistics and history

- Local history with results by quiz type, mode, difficulty, correctness and date.
- **Top 5** chart.
- **Top 15** results table.
- Separate Bible and Hymnal statistics.
- Export history as **JSON** and **CSV**.
- Import history to restore or merge previous data.

### 🎨 User experience

- Modern, clean and minimalist interface.
- Rounded cards, clear visual hierarchy and comfortable spacing.
- Automatic or manual light/dark theme.
- Subtle animations.
- Haptic feedback for correct and wrong answers.
- Optional sound effects for correct and wrong answers.

---

## 🚀 Tech stack

- [Expo Managed Workflow](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)
- [React Native SVG](https://github.com/react-native-svg/react-native-svg)
- [Expo AV](https://docs.expo.dev/versions/latest/sdk/av/)
- [Expo Sharing](https://docs.expo.dev/versions/latest/sdk/sharing/)
- [Expo FileSystem](https://docs.expo.dev/versions/latest/sdk/filesystem/)
- [Expo DocumentPicker](https://docs.expo.dev/versions/latest/sdk/document-picker/)

---

## 📁 Folder structure

```txt
Verbo-Hino/
├── assets/
│   ├── arc.json
│   ├── hinario_pronto.json
│   ├── common_passages.json
│   ├── common_hymns.json
│   ├── icon.png
│   ├── splash.png
│   └── audio/
│       ├── correct.mp3
│       └── wrong.mp3
├── src/
│   ├── components/
│   │   ├── AnswerButton.js
│   │   ├── Hearts.js
│   │   └── VerseCard.js
│   ├── screens/
│   │   ├── GameScreen.js
│   │   └── StatsScreen.js
│   ├── utils/
│   │   ├── asyncStorage.js
│   │   ├── dataLoader.js
│   │   ├── difficulty.js
│   │   ├── exporters.js
│   │   ├── preferences.js
│   │   ├── questionFactory.js
│   │   ├── sound.js
│   │   └── statistics.js
│   ├── data/
│   │   └── rawList.js
│   ├── theme.js
│   └── web/
│       └── asyncStorageShim.js
├── public/
│   └── index.html
├── android/
├── App.js
├── app.json
├── package.json
├── vercel.json
└── README.md
```

---

## 📲 Direct APK installation

The easiest way to test **Verbo & Hino** is by installing the APK directly on an Android device.

1. Download the APK from the [Downloads](#downloads) section.
2. On Android, allow installation from unknown sources if required.
3. Open the downloaded file.
4. Tap **Install**.
5. Open the app and start playing.

> 💡 The APK link can be updated whenever a new version is released.

---

## ⚙️ Running the project

### Requirements

- Node.js LTS.
- Expo CLI installed globally or usage through `npx`.
- A physical device with Expo Go or a configured Android/iOS emulator.

### Step by step

Clone the repository:

```bash
git clone https://github.com/BarujaFe1/VerboHino.git
cd VerboHino
```

Install dependencies:

```bash
npm install
```

Start the project:

```bash
npm start
```

Or:

```bash
npx expo start
```

Then scan the QR Code with **Expo Go** or open the app on an emulator.

---

## 📦 Build and release

### Generate Android APK for testing

Install EAS CLI:

```bash
npm install -g eas-cli
```

Configure the project:

```bash
eas build:configure
```

Generate a preview APK:

```bash
eas build --profile preview --platform android
```

### Generate AAB for Play Store

```bash
eas build --profile production --platform android
```

The final file will be available on the Expo dashboard or through the link generated at the end of the build.

---

## 📥 Downloads

- **Web (production):** [https://verbo-hino.vercel.app](https://verbo-hino.vercel.app)
- **APK:** build with `eas build --profile preview --platform android` (EAS projectId in `app.json`)
- **Project presentation:** [View PDF](./assets/slide.pdf) (if available)

> Update these links whenever a new version is released.

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the project.
2. Create a branch for your change:

```bash
git checkout -b feature/new-feature
```

3. Commit your changes:

```bash
git commit -m "Add new feature"
```

4. Push to GitHub:

```bash
git push origin feature/new-feature
```

5. Open a Pull Request.

---

## 👨‍💻 Author

Developed by **BarujaFe**

[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github)](https://github.com/BarujaFe1)
[![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/barujafe)

---

## 🖼️ Preview

<p align="center">
  <img src="./assets/screenshots/gameplay.png" alt="Gameplay preview" width="220" />
  <img src="./assets/screenshots/stats.png" alt="Stats screen" width="220" />
</p>

---

<a id="license--licença"></a>

## 📄 License / Licença

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

Distribuído sob a **Licença MIT**. Consulte [`LICENSE`](./LICENSE) para mais informações.

---

<div align="center">
  <sub>
    Built with React Native, Expo and care for a cleaner learning experience.<br />
    Construído com React Native, Expo e cuidado para uma experiência de aprendizado mais limpa.
  </sub>
</div>
