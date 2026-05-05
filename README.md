# Signal PWA

Suivi quotidien · Terrain & Liens — application de soutien psychologique légère.

## Structure

```
signal-pwa/
├── index.html          ← App complète (UI + IA)
├── sw.js               ← Service Worker (cache auto-update)
├── manifest.json       ← PWA manifest
├── icon.png            ← Icône 512×512
├── icon-192.png        ← Icône 192×192
└── .github/
    └── workflows/
        └── deploy.yml  ← GitHub Actions → GitHub Pages
```

## Déploiement en 5 étapes

1. **Créer un repo GitHub** (public ou privé)

2. **Push les fichiers**
   ```bash
   git init
   git add .
   git commit -m "init Signal PWA"
   git remote add origin https://github.com/TON-USER/signal.git
   git push -u origin main
   ```

3. **Activer GitHub Pages**
   - Settings → Pages → Source : **GitHub Actions**

4. **Configurer la clé API**
   - Ouvrir l'app sur `ton-user.github.io/signal`
   - Taper sur ⚙ en haut à droite
   - Coller ta clé Anthropic (`sk-ant-...`)
   - La clé est stockée dans `localStorage` — jamais dans le code

5. **Installer sur mobile**
   - Chrome/Android : "Ajouter à l'écran d'accueil"
   - Safari/iOS : Partager → "Sur l'écran d'accueil"

## Mise à jour

Chaque `git push` déclenche GitHub Actions qui :
- Injecte un `CACHE_VERSION` avec le timestamp du build
- Déploie sur GitHub Pages
- Le Service Worker purge l'ancien cache et charge la nouvelle version

## Clé API

La clé Anthropic est stockée uniquement dans le `localStorage` du navigateur.
Elle n'est **jamais** dans le code source.

Obtenir une clé : https://console.anthropic.com
