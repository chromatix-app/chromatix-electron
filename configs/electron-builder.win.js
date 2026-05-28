const commonConfig = require('./electron-builder.common');

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 *
 * Windows config — used by draft-win-*, build-win-*, and ship-win scripts.
 * Arch (--ia32 / --x64) is controlled per-script via CLI flag.
 */
const config = Object.assign({}, commonConfig, {
  win: {
    artifactName: 'Chromatix-${version}-windows.${ext}',
    target: [
      {
        target: 'nsis',
        arch: ['x64', 'ia32', 'arm64'],
      },
    ],
  },
});

module.exports = config;
