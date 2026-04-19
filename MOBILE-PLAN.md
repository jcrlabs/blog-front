# Blog Mobile — Plan Capacitor

App movil para JCRLabs Tech Blog (Android + iOS) usando Capacitor.
Shell nativo que carga la web live desde `https://tech-blog.jcrlabs.net`.

## Estrategia

- `server.url` apunta a la web desplegada — mismo enfoque que chat
- Auto-update: cada deploy a K8s actualiza la app automaticamente
- Zero code changes en el web — el APK/IPA es solo un wrapper nativo
- Static export descartado: `post/[slug]` usa server components con datos dinamicos, incompatible con `output: 'export'`

## Implementacion (completada)

### 1. Capacitor instalado
- `@capacitor/core`, `@capacitor/android`, `@capacitor/ios`, `@capacitor/status-bar`, `@capacitor/splash-screen`
- `@capacitor/cli` en devDependencies

### 2. capacitor.config.ts
- `appId: 'net.jcrlabs.blog'`
- `server.url: 'https://tech-blog.jcrlabs.net'`
- SplashScreen con backgroundColor `#050507`

### 3. Proyectos nativos generados
- `android/` y `ios/` creados via `cap add`

### 4. Scripts package.json
- `mobile:sync` — sync capacitor
- `mobile:android` — build debug APK
- `mobile:ios` — abrir en Xcode

### 5. GitHub Actions workflow
- `.github/workflows/mobile-build.yml` — trigger manual
- Genera APK debug como artifact descargable
- Opcion de build iOS (unsigned, simulator)

## CI/CD

Build via GitHub Actions → descargar APK desde artifacts.
Ver `SHARED-MOBILE-CICD.md` en raiz de jcrlabs para patron compartido.

## Checklist de verificacion

- [ ] App abre y carga tech-blog.jcrlabs.net
- [ ] Posts cargan correctamente
- [ ] Navegacion a post individual funciona
- [ ] Animaciones Framer Motion OK
- [ ] Scroll y UX se sienten nativos
- [ ] App se actualiza sola al hacer deploy web
