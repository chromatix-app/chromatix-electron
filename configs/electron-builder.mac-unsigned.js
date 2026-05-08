const macConfig = require('./electron-builder.mac');

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 *
 * macOS unsigned config — used by draft-mac only.
 * Skips code signing so builds are fast and don't require credentials.
 */
const config = Object.assign({}, macConfig, {
  mac: Object.assign({}, macConfig.mac, {
    identity: null,
    target: [
      { target: 'dir', arch: ['arm64'] },
      { target: 'dir', arch: ['universal'] },
    ],
  }),
});

module.exports = config;
