// ======================================================================
// IMPORTS & SETUP
// ======================================================================

const { app } = require('electron');

app.setName('Chromatix');

// On Linux (including Wayland), tell GNOME which .desktop file belongs to this
// app so the dock icon matches the running window correctly.
if (process.platform === 'linux') {
  app.setDesktopName('chromatix.desktop');
}

const message = require('./message');

require('./updates');
require('./window');

// ======================================================================
// INIT
// ======================================================================

message.init();
