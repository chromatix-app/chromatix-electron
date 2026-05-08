const commonConfig = require('./electron-builder.common');

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 *
 * Linux config — used by draft-lin-* build scripts (currently commented out).
 */
const config = Object.assign({}, commonConfig, {
  linux: {
    category: 'Music',
    target: ['deb', 'freebsd', 'rpm', 'AppImage', 'snap'],
  },
});

module.exports = config;
