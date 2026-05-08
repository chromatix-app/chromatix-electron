/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 *
 * Shared config inherited by all platform-specific configs.
 */
const config = {
  appId: 'com.chromatix.app',
  productName: 'Chromatix',
  directories: {
    buildResources: 'assets/app-icons/white',
  },
  publish: [
    {
      provider: 'github',
      owner: 'chromatix-app',
      repo: 'chromatix-release',
    },
  ],
  files: ['!dist*/**'],
};

module.exports = config;
