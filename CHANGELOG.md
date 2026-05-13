# Changelog

<!-- CHANGELOG SPLIT MARKER -->

## 0.5.0

### Code changes:

- Added ESLint (flat config) with `@eslint/js`, `eslint-config-prettier`, and `globals`
- Added Prettier as a dev dependency
- Added knip for dead code and unused dependency detection
- Added husky + lint-staged for pre-commit quality checks
- Moved `dotenv` and `dotenv-cli` from `dependencies` to `devDependencies`
- Moved electron-builder config from `package.json` into per-platform JS files in `configs/` (common, mac, mac-unsigned, win, linux)
- Renamed dev build scripts from `dev-*` to `draft-*`; simplified `build-*` and `ship-*` scripts to reference config files
- Added `npm start` as an alias for `npm run dev`
- Fixed incorrect variable reference in `update-available` handler in `updates.js`
- Added "Use of AI" section to `README.md`
- Added `.github/copilot-instructions.md` documenting project conventions

<!-- CHANGELOG SPLIT MARKER -->

## 0.4.0

- Fix for Google login
- Update app background colour after load
- NPM updates

<!-- CHANGELOG SPLIT MARKER -->

## 0.3.0

- Define app name earlier
- Setup persistent settings
- Updated to handle menu commands from front end

<!-- CHANGELOG SPLIT MARKER -->

## 0.2.0

- Fix to allow Google sign-in
- Improved link handling
- Add player controls to Windows taskbar

<!-- CHANGELOG SPLIT MARKER -->

## 0.1.5

- Windows build support
- Minor amends for Windows
- Updated link handling, block opening second window
- Ensure external links open in external browser

<!-- CHANGELOG SPLIT MARKER -->

## 0.1.4

- Created README
- Tweaks to env handling and build scripts
- Apple Universal build support
- macOS code signing support
- Auto-updates working
- Offline handling
- Swipe page support
- Custom app menu
