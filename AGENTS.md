# Copilot Instructions

## Project Overview

This is the **Electron shell** for Chromatix, a desktop music player for Plex and Jellyfin. It is a separate project from the Chromatix web app (React/Vite). The Electron app loads the Chromatix web app from `https://chromatix.app` in a `BrowserWindow` — it does not bundle the web app. In dev mode (`npm start`) it loads from `http://localhost:3000` instead.

## Tech Stack

- **Electron** (current: v39) — desktop shell
- **electron-builder** — packaging and distribution
- **electron-updater** — auto-update via GitHub Releases
- **electron-window-state** — persists window size/position across restarts
- **electron-log** — available but currently unused/commented out
- **dotenv / dotenv-cli** — loads `.env` for production builds (Apple notarization, GitHub token)
- **nodemon** — restarts the Electron process on file changes during development
- All Electron main-process code is **CommonJS** (`require`/`module.exports`), not ESM

## Architecture

```
electron/           # Main process code (Node.js/CommonJS)
  app.js            # Entry point — sets app name, bootstraps message and window modules
  window.js         # BrowserWindow creation, app lifecycle, routing, offline fallback, media controls
  menu.js           # Native app menu template (platform-aware: macOS vs Windows)
  message.js        # IPC listener — receives messages from the web app front end
  preload.js        # Preload script — exposes window.isElectron, window.electronProcess, window.ipcRenderer
  store.js          # Simple file-backed settings store (chromatix-settings.json in userData)
  updates.js        # Auto-update logic via electron-updater
  utils.js          # Utility functions (currently just debounce)
  _config.js        # Build-time injected config: appVersion, buildDate, isLocal
configs/            # electron-builder configuration files
  electron-builder.common.js      # Shared base config
  electron-builder.mac.js         # macOS signed builds (arm64 + universal dmg + zip)
  electron-builder.mac-unsigned.js # macOS unsigned dev builds (arm64 + universal dir)
  electron-builder.win.js         # Windows builds (x64 + ia32 + arm64, combined universal nsis installer)
  electron-builder.linux.js       # Linux builds (AppImage, deb, rpm — x64 + arm64)
lib/                # Node scripts run at build time
  vars-set-local.js # Patches _config.js for local dev (isLocal: true, appVersion, buildDate)
  vars-set-prod.js  # Patches _config.js for production (isLocal: false, appVersion, buildDate)
  vars-reset.js     # Resets _config.js back to null/false defaults after every build
  run-timed.js      # Wraps a command and prints elapsed time on completion
entitlements/       # macOS code signing entitlement plists
  default.mas.plist           # App entitlements
  default.mas.child.plist     # Child process entitlements
offline/
  index.html        # Shown when no internet connection is detected on launch
assets/
  app-icons/        # Icons used by electron-builder for the packaged app
```

## IPC Communication

The web app communicates with the Electron main process via `window.ipcRenderer` (exposed in `preload.js`). The main process listens in `message.js`. `sendMessage` sends messages back to the front end. All supported channels are defined in `message.js` — read that file for the current list before adding new ones. Keep channel names as plain kebab-case strings matching what the web app sends.

## Window Behaviour

`window.js` handles all BrowserWindow creation and app lifecycle. Key behaviours vary by platform — read `window.js` for the current specifics. Notable patterns:

- macOS hides the window on close rather than quitting; the dock click re-shows it
- Windows uses a custom title bar overlay with dynamically updated colours
- Linux sets `app.setDesktopName('chromatix.desktop')` for correct GNOME dock icon matching, and explicitly sets the window icon
- User agent is overridden globally to work around OAuth providers blocking Electron's default UA
- External URLs open in the default browser; certain auth and internal routes stay in-app

## URL Routing

Routes (prod, dev, local) are defined at the top of `window.js`. `isDev` is `true` when launched with `--dev` (e.g. `npm start`).

## Build Config Pattern

Build configuration is split into per-platform JS files in `configs/` rather than in `package.json`. Each file uses `Object.assign({}, commonConfig, { ...platformOverrides })`. The `"build"` key is intentionally absent from `package.json`.

- `draft-*` scripts: use `vars-set-local`, no `.env`, no signing, output is an unpacked app (`dir` target). Note: `draft-win` uses `--dir` which skips installer creation; `draft-lin` also uses `--dir`.
- `build-*` scripts: use `vars-set-prod` + `dotenv --`, produce installers, no publish
- `ship-*` scripts: same as `build-*` but adds `-p always` to publish to GitHub Releases
- `build-all` / `ship-all`: run win, lin, mac in sequence

## `_config.js` Pattern

`electron/_config.js` is the runtime config file. It always lives at its default (null) state in source control:

```js
module.exports = { appVersion: null, buildDate: null, isLocal: false };
```

Before every build/start, a `lib/vars-set-*.js` script patches it in-place. After every build, `lib/vars-reset.js` resets it. Never manually edit `_config.js` — always run the appropriate `vars-set-*` script.

## Settings Persistence

`store.js` persists settings to a JSON file in the Electron `userData` directory. Read `store.js` for the current stored values and available accessor functions.

## Environment Variables (`.env`)

Only used during `build-*` and `ship-*` scripts via `dotenv-cli`. Never loaded in the running app.

## Coding Conventions

- All main-process files use CommonJS (`require` / `module.exports`)
- Section comments use banner style: `// ======================================================================`
- Platform branching is done with `process.platform === 'darwin'` (macOS) and `process.platform !== 'darwin'` (Windows/Linux)
- `isDev` is derived from `process.argv.includes('--dev')` or `isLocal` from `_config.js`
- Keep IPC channel names as plain kebab-case strings matching what the web app sends

## Key Scripts

- `npm start` / `npm run dev` — Run in dev mode (loads localhost:3000, `isLocal: true`)
- `npm run nodemon` — Same as dev but restarts on file changes
- `npm run draft-{platform}` — Build unsigned/unpacked app for local testing
- `npm run build-{platform}` — Build signed installers (no publish)
- `npm run ship-{platform}` — Build and publish to GitHub Releases

Supported platforms: `mac`, `win`, `lin`.

## Maintaining These Instructions

When you make changes to this project, keep this file up to date. If you add a new IPC channel, change the build config structure, add a new setting to the store, or change how `_config.js` is managed, update the relevant section. Outdated guidance is worse than none.
