# Deployment — Verbo & Hino

## Web (Vercel) — produção atual

URL: https://verbo-hino.vercel.app

### Configuração (`vercel.json`)

- `buildCommand`: `npx expo export --platform web`
- `outputDirectory`: `dist`
- Rewrite SPA para `index.html`
- Cache imutável em `/_expo/static/*`

### Deploy local / CLI

```bash
npm install
npm run export:web
# dist/ pronto para qualquer host estático
```

Com Vercel CLI (se vinculado):

```bash
npx vercel --prod
```

Ou conecte o repositório no dashboard Vercel (framework: Other / estático com o `vercel.json` acima).

### SEO / OG

`public/index.html` inclui meta description, Open Graph e link de volta ao portfólio.

---

## Android (EAS)

`app.json` → `android.package`: `com.barujafe.verbohino`  
EAS `projectId` em `extra.eas.projectId`.

### Preview APK

```bash
npm install -g eas-cli
eas login
npm run eas:preview
# ou: eas build --profile preview --platform android
```

### Production AAB (Play Store)

```bash
eas build --profile production --platform android
```

Perfis em `eas.json`.

---

## iOS

`bundleIdentifier`: `com.barujafe.verbohino`  
Requer conta Apple Developer + `eas build --platform ios` (não executado neste passe).

---

## Variáveis de ambiente

Nenhuma obrigatória. Ver `.env.example`.

---

## Checklist pós-deploy web

1. Abrir a URL e jogar 1 pergunta Bíblia + 1 Hinário.
2. Alternar tema.
3. Abrir Estatísticas (empty state ou dados).
4. Exportar JSON no browser (download).
5. Confirmar header com links Portfólio / GitHub.
