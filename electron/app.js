// ======================================================================
// IMPORTS & SETUP
// ======================================================================

const path = require('path');
const os = require('os');
const { app } = require('electron');

app.setName('Chromatix');

// On Linux (including Wayland), tell GNOME which .desktop file belongs to this
// app so the dock icon matches the running window correctly.
if (process.platform === 'linux') {
  app.setDesktopName('chromatix.desktop');

  // When running as an AppImage, the AppImage runtime may override HOME or
  // XDG_CONFIG_HOME to a path inside the FUSE mount, which is a fresh random
  // directory every launch — wiping localStorage, cookies, and all state.
  // Explicitly pin userData to ~/.config/Chromatix to prevent this.
  if (process.env.APPIMAGE) {
    app.setPath('userData', path.join(os.homedir(), '.config', 'Chromatix'));
  }
}

const message = require('./message');

require('./updates');
require('./window');

// ======================================================================
// INIT
// ======================================================================

message.init();
