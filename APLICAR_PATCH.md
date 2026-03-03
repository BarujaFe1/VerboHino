# Patch — Nome + Logo (Verbo & Hino)

Este patch adiciona:
- Nome do app: **Verbo & Hino**
- Ícone do app (iOS/Android)
- Adaptive Icon (Android)
- Splash screen
- Título no header do app

## Como aplicar
1) Abra a pasta do seu projeto (onde está `App.js`, `app.json` e a pasta `assets/`)
2) Copie e **cole por cima** os arquivos deste patch:
   - `App.js`
   - `app.json`
   - `assets/icon.png`
   - `assets/adaptive-icon.png`
   - `assets/splash.png`
   - `assets/verbo_hino_wordmark.png` (opcional: para divulgação)

3) Rode:
```bash
npm install
npx expo start -c
```

## Build do APK (EAS)
```bash
npm i -g eas-cli
eas login
eas build:configure
eas build --profile preview --platform android
```
