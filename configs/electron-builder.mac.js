const commonConfig = require('./electron-builder.common');

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 *
 * macOS config — used by build-mac and ship-mac scripts.
 * Requires Apple notarization env vars (APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD,
 * APPLE_TEAM_ID) from .env, loaded via dotenv-cli.
 */
const config = Object.assign({}, commonConfig, {
  mac: {
    category: 'public.app-category.music',
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: './entitlements/default.mas.plist',
    entitlementsInherit: './entitlements/default.mas.child.plist',
    target: [
      { target: 'dmg', arch: ['arm64'] },
      { target: 'zip', arch: ['arm64'] },
      { target: 'dmg', arch: ['universal'] },
      { target: 'zip', arch: ['universal'] },
    ],
  },
});

module.exports = config;
