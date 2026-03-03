
<div align="center">
  <img src="./assets/icon.png" alt="Verbo & Hino Logo" width="120" height="120" />
  <h1>Verbo & Hino</h1>
  <p><strong>Gamificando o aprendizado cristão</strong></p>

  <p>
    <a href="#sobre-o-projeto">Sobre</a> •
    <a href="#funcionalidades">Funcionalidades</a> •
    <a href="#tecnologias">Tecnologias</a> •
    <a href="#instalação-direta-apk">APK</a> •
    <a href="#como-executar">Como executar</a> •
    <a href="#build-e-publicação">Build</a> •
    <a href="#downloads">Downloads</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version 1.0.0" />
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License MIT" />
    <img src="https://img.shields.io/badge/Expo-49.0.0-000020.svg?logo=expo" alt="Expo" />
    <img src="https://img.shields.io/badge/React%20Native-0.72-61DAFB.svg?logo=react" alt="React Native" />
  </p>
</div>

---

## 📖 Sobre o projeto

**Verbo & Hino** é um aplicativo mobile que transforma o estudo da Bíblia e do Hinário da CCB em uma experiência divertida e desafiadora através de quizzes. Com uma interface moderna, minimalista e inspirada no estilo Apple, o app oferece três modos de jogo, níveis de dificuldade e estatísticas detalhadas para acompanhar seu progresso.

> “Conhecereis a verdade, e a verdade vos libertará.” — João 8:32

---

## ✨ Funcionalidades

### 🎮 Tipos de Quiz
- **Bíblia:** um versículo é exibido e você deve escolher a referência correta (Livro capítulo:verso).
- **Hinário:** uma estrofe é exibida e você deve identificar o hino correto (Nº — Título).

### 🧠 Níveis de dificuldade
- **Fácil / Médio / Difícil** — balanceados com base na popularidade dos versículos e hinos.

### 🕹️ Modos de jogo
- **Clássico:** fluxo contínuo, treino livre.
- **Sobrevivência:** comece com 3 vidas; cada erro reduz uma vida.
- **Relógio (Time Attack):** tempo limitado por pergunta; o tempo esgotado conta como erro.

### 🔥 Mecânicas especiais
- Pontuação por acerto e **streak** (sequência de acertos).
- **Multiplicador** (x2 após uma sequência).
- Ajudas estratégicas:
  - **50/50:** remove duas alternativas erradas.
  - **Dica:** mostra o testamento (Bíblia) ou a faixa de números (Hinário).

### 📊 Estatísticas e histórico
- Histórico local com todos os seus resultados (tipo, acerto/erro, modo, dificuldade, timestamp).
- Gráfico dos **Top 5** e tabela dos **Top 15** (Bíblia e Hinário separadamente).
- Exportação para **JSON** e **CSV**.
- Importação de histórico para restaurar ou mesclar dados.

### 🎨 Experiência do usuário
- UI “Apple-like”: cards arredondados, tipografia limpa, espaçamento generoso.
- Animações sutis e feedback tátil (vibração) em acertos/erros.
- Sons opcionais (correct.mp3 / wrong.mp3).
- Tema **claro/escuro** automático ou manual.

---

## 🚀 Tecnologias utilizadas

- [Expo (managed)](https://expo.dev/) — desenvolvimento rápido e compatível com Expo Go.
- [React Native](https://reactnative.dev/) — base do aplicativo.
- [React Navigation](https://reactnavigation.org/) — navegação entre telas.
- [React Native Paper](https://callstack.github.io/react-native-paper/) — componentes UI prontos e temas.
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) — persistência local.
- [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit) + [React Native SVG](https://github.com/react-native-svg/react-native-svg) — gráficos estatísticos.
- [Expo AV](https://docs.expo.dev/versions/latest/sdk/av/) — reprodução de áudio (opcional).
- [Expo Sharing](https://docs.expo.dev/versions/latest/sdk/sharing/), [FileSystem](https://docs.expo.dev/versions/latest/sdk/filesystem/), [DocumentPicker](https://docs.expo.dev/versions/latest/sdk/document-picker/) — exportação/importação de arquivos.

---

## 📁 Estrutura de pastas

```
Verbo&Hino/
├── assets/                     # Imagens, fontes, JSONs, áudios
│   ├── arc.json                 # Bíblia completa
│   ├── hinario_pronto.json      # Hinário completo
│   ├── common_passages.json     # Passagens mais frequentes
│   ├── common_hymns.json        # Hinos mais frequentes
│   ├── audio/                    # correct.mp3, wrong.mp3
│   └── icon.png / splash.png     # Branding
├── src/
│   ├── screens/
│   │   ├── GameScreen.js         # Tela principal do jogo
│   │   └── StatsScreen.js        # Tela de estatísticas
│   ├── utils/
│   │   ├── dataLoader.js         # Carrega e prepara os pools de perguntas
│   │   ├── questionFactory.js    # Gera perguntas com distratores
│   │   ├── statistics.js         # Agregação de dados do histórico
│   │   ├── exporters.js          # Exportação/importação JSON/CSV
│   │   └── preferences.js        # Preferências (tema, som)
│   ├── data/
│   │   └── rawList.js            # Lista bruta de referências bíblicas
│   ├── theme.js                  # Configuração de temas (claro/escuro)
│   └── App.js                    # Entry point, navegação e contextos
├── .gitignore
├── app.json
├── package.json
└── README.md
```

---

## 📲 Instalação direta (APK)

A maneira mais rápida de experimentar o **Verbo & Hino** é baixar o APK e instalar diretamente no seu celular Android.

1. **Baixe o APK** na seção [Downloads](#downloads) abaixo.
2. No seu celular, permita a instalação de apps de fontes desconhecidas (geralmente em *Configurações > Segurança*).
3. Abra o arquivo baixado e clique em **Instalar**.
4. Pronto! Agora é só abrir o app e começar a jogar.

> 💡 *O APK é gerado automaticamente a cada nova versão. Você sempre encontrará o link atualizado na seção de downloads.*

---

## ⚙️ Como executar o projeto (para desenvolvedores)

### Pré-requisitos

- Node.js (versão LTS recomendada)
- Expo CLI (`npm install -g expo-cli`) ou use `npx expo`
- Um dispositivo físico com **Expo Go** instalado ou um emulador configurado

### Passos

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/Verbo-Hino.git
   cd Verbo-Hino
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o projeto:
   ```bash
   npm start
   # ou
   expo start
   ```

4. Escaneie o QR Code com o aplicativo **Expo Go** (Android/iOS) ou pressione `a` para abrir no emulador Android.

---

## 📲 Build e publicação

### Gerar APK (Android)

1. Instale o **EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. Configure o EAS (se ainda não fez):
   ```bash
   eas build:configure
   ```

3. Para gerar um **APK de teste**:
   ```bash
   eas build --profile preview --platform android
   ```

4. Para gerar um **AAB** para a Play Store:
   ```bash
   eas build --profile production --platform android
   ```

> O arquivo gerado estará disponível para download no site do Expo ou via link fornecido ao final do build.

---

## 📥 Downloads

- **APK (última versão):** [Download Verbo & Hino.apk](https://expo.dev/accounts/seu-usuario/projects/Verbo-Hino/builds/ultimo-apk)  
- **Slide de apresentação do projeto:** [Ver PDF](./assets/slide.pdf)

> *Links atualizados conforme novas versões são lançadas.*

---

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Sinta-se à vontade para abrir uma **issue** ou enviar um **pull request**.

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

## 👨‍💻 Autor

Desenvolvido por **BarujaFe**  
[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github)](https://github.com/BarujaFe1)  
[![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/barujafe)

---

<p align="center">
  <img src="./assets/screenshots/gameplay.png" alt="Gameplay preview" width="200" />
  <img src="./assets/screenshots/stats.png" alt="Stats screen" width="200" />
</p>
