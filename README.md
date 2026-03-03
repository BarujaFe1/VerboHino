# Quiz Bíblia + Hinário (Expo / React Native)

Um único app com dois tipos de jogo:
- **Bíblia**: aparece um versículo e você escolhe **a referência correta** (Livro cap:verso)
- **Hinário**: aparece uma estrofe e você escolhe **o hino correto** (Nº — Título)

Inclui:
- 3 dificuldades (Fácil/Médio/Difícil) balanceadas por popularidade (arquivos `common_*`)
- 3 modos (Clássico / Sobrevivência / Relógio)
- Ajudas (50/50 e Dica)
- Timer com barra no modo Relógio
- Som de acerto/erro (opcional) + vibração/haptics
- Histórico local + Estatísticas com gráfico e tabela
- Exportar/Importar histórico JSON e exportar CSV

---

## 1) O que você precisa instalar (iniciante)
1) **Node.js LTS**
2) No celular: **Expo Go**
3) No PC (para build): **EAS CLI** (passo abaixo)

---

## 2) Onde colar seus arquivos JSON (OBRIGATÓRIO)
Você disse que já tem tudo em JSON pronto. Cole nos caminhos:

- **Bíblia**: `assets/arc.json`
  - formato esperado (exemplo):
  ```json
  [{"abbrev":"Gn","name":"Gênesis","chapters":[["verso1","verso2"]]}]
  ```

- **Hinário**: `assets/hinario_pronto.json`
  - formato esperado (exemplo):
  ```json
  [{"numero":1,"titulo":"...","estrofes":[{"numero":1,"texto":"..."}]}]
  ```

- **Lista de referências bíblicas (lista_bruta)**: `src/data/rawList.js`
  - substitua o texto `RAW_LIST` pela sua lista completa.

---

## 3) Áudio (opcional)
Coloque:
- `assets/audio/correct.mp3`
- `assets/audio/wrong.mp3`

Se não colocar, o app funciona sem som.

---

## 4) Rodar no Expo Go
No terminal, dentro da pasta do projeto:

```bash
npm install
npm start
```

Depois:
- Abra o **Expo Go** no celular e escaneie o QR Code.

---

## 5) Tema claro/escuro
No topo do app, toque no botão **(ícone de tema)** para alternar entre **Claro** e **Escuro**.

---

## 6) Build de APK / AAB com EAS
Instale e faça login:

```bash
npm i -g eas-cli
eas login
```

Configure uma vez:

```bash
eas build:configure
```

### APK (teste)
```bash
eas build --profile preview --platform android
```

### AAB (Play Store)
```bash
eas build --profile production --platform android
```

---

## 7) Como a dificuldade é balanceada
- O app usa:
  - `assets/common_passages.json` (passagens mais usadas)
  - `assets/common_hymns.json` (hinos mais usados)
- **Fácil**: itens mais populares
- **Médio**: populares medianos
- **Difícil**: menos populares + distratores mais parecidos

---

## 8) Ajustes rápidos (se quiser)
- Quer mais versículos “fora da lista”? Ajuste `limit` em `buildExtraBiblePool`:
  - `src/utils/dataLoader.js`
- Quer mudar o tempo do Relógio? Ajuste `15` em:
  - `src/screens/GameScreen.js`

---
