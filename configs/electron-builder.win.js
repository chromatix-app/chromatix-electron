const commonConfig = require('./electron-builder.common');

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 *
 * Windows config — used by draft-win-*, build-win-*, and ship-win scripts.
 *
 * x64 only. ia32 (32-bit) Windows hardware is effectively extinct — Windows
 * 11 doesn't support 32-bit installs at all. arm64 was dropped after hitting
 * a longstanding electron-builder/NSIS bug (see electron-userland/electron-builder
 * #4653, #5461) where the main Chromatix.exe silently fails to extract on
 * install while every other file extracts fine, leaving a broken shortcut —
 * reproduced consistently even as a standalone single-arch installer, so it's
 * not fixable by adjusting this config. arm64 Windows devices run the x64
 * build fine via Windows' built-in x64 emulation.
 *
 * Previously this also built a combined multi-arch NSIS installer, which had
 * the same silent-extraction-failure bug — that's what originally surfaced
 * this issue. electron-updater needs no special handling for a single-arch
 * target; it already selects the matching arch entry from latest.yml.
 */
const config = Object.assign({}, commonConfig, {
  win: {
    artifactName: 'Chromatix-${version}-windows-${arch}.${ext}',
    target: [
      {
        target: 'nsis',
        arch: ['x64'],
      },
    ],
  },
});

module.exports = config;
