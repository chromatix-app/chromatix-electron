const path = require('path');
const fs = require('fs');

const commonConfig = require('./electron-builder.common');

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 *
 * Linux config — used by draft-lin, build-lin, and ship-lin scripts.
 */
const config = Object.assign({}, commonConfig, {
  // Wrap the electron binary in a shell script that passes --no-sandbox.
  // This is needed because AppImages cannot have setuid chrome-sandbox binaries
  // (read-only FUSE filesystem), and app.commandLine.appendSwitch runs too late
  // — the sandbox check in C++ happens before JS starts. executableArgs only
  // injects the flag into the .desktop file, not direct AppImage execution.
  afterPack: async ({ appOutDir, packager }) => {
    if (packager.platform.name !== 'linux') return;
    const exeName = 'chromatix';
    const exePath = path.join(appOutDir, exeName);
    const realExePath = path.join(appOutDir, `${exeName}-real`);
    fs.renameSync(exePath, realExePath);
    fs.writeFileSync(
      exePath,
      `#!/bin/bash\nexec "$(dirname "$(readlink -f "$0")")/${exeName}-real" --no-sandbox --class=Chromatix "$@"\n`
    );
    fs.chmodSync(exePath, 0o755);
  },
  linux: {
    executableName: 'chromatix',
    category: 'AudioVideo',
    artifactName: 'Chromatix-${version}-linux-${arch}.${ext}',
    icon: 'assets/app-icons',
    target: [
      { target: 'AppImage', arch: ['x64', 'arm64'] },
      { target: 'deb', arch: ['x64', 'arm64'] },
      { target: 'rpm', arch: ['x64', 'arm64'] },
    ],
    desktop: {
      entry: {
        Name: 'Chromatix',
        Type: 'Application',
        Categories: 'AudioVideo;Audio;Music;Player;',
        StartupWMClass: 'Chromatix',
      },
    },
  },
  rpm: {
    // Avoid /usr/lib/.build-id collisions with other Electron RPMs.
    fpm: ['--rpm-rpmbuild-define', '_build_id_links none'],
  },
});

module.exports = config;
