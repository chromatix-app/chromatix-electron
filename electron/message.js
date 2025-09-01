// ======================================================================
// IMPORTS
// ======================================================================

const { ipcMain } = require('electron');

const { getMainWindowRef, toggleAllowInsecure } = require('./store');
const { setMainMenu, updateAppInfo, updateColorTheme, updatePlayerControls } = require('./window');

// ======================================================================
// STATE
// ======================================================================

let listenerArray = {};

// ======================================================================
// LISTEN FOR INCOMING MESSAGES FROM FRONT END
// ======================================================================

const init = () => {
  ipcMain.on('app-info', (x, message) => {
    updateAppInfo(message);
  });
  ipcMain.on('color-theme', (x, message) => {
    updateColorTheme(message);
  });
  ipcMain.on('player-status', (x, message) => {
    updatePlayerControls(message);
  });

  // MENU - VIEW
  // reload
  // force-reload
  // toggle-dev-tools
  // reset-zoom
  // zoom-in
  // zoom-out
  // togglefullscreen

  // MENU - WINDOW
  // minimize
  // zoom
  // front
  // close

  // MENU - ADVANCED
  // allow-insecure-connections

  ipcMain.on('reload', () => {
    getMainWindowRef().webContents.reload();
  });
  ipcMain.on('force-reload', () => {
    getMainWindowRef().webContents.reloadIgnoringCache();
  });
  ipcMain.on('toggle-dev-tools', () => {
    getMainWindowRef().webContents.toggleDevTools();
  });
  ipcMain.on('reset-zoom', () => {
    getMainWindowRef().webContents.setZoomLevel(0);
  });
  ipcMain.on('zoom-in', () => {
    getMainWindowRef().webContents.setZoomLevel(getMainWindowRef().webContents.getZoomLevel() + 1);
  });
  ipcMain.on('zoom-out', () => {
    getMainWindowRef().webContents.setZoomLevel(getMainWindowRef().webContents.getZoomLevel() - 1);
  });
  ipcMain.on('togglefullscreen', () => {
    getMainWindowRef().setFullScreen(!getMainWindowRef().isFullScreen());
  });

  ipcMain.on('minimize', () => {
    getMainWindowRef().minimize();
  });
  ipcMain.on('zoom', () => {
    if (getMainWindowRef()?.isMaximized()) {
      getMainWindowRef().unmaximize();
    } else {
      getMainWindowRef()?.maximize();
    }
  });
  ipcMain.on('front', () => {
    getMainWindowRef().focus();
  });
  ipcMain.on('close', () => {
    getMainWindowRef().close();
  });

  ipcMain.on('allow-insecure-connections', () => {
    toggleAllowInsecure();
    setMainMenu();
  });
};

// ======================================================================
// SEND MESSAGE TO FRONT END
// ======================================================================

const sendMessage = (msg) => {
  try {
    getMainWindowRef().webContents.send('message', msg);
  } catch (e) {
    console.log('ERROR SENDING MESSAGE');
  }
};

const addMessageListener = (string, callback) => {
  listenerArray[string] = callback;
};

// ======================================================================
// EXPORTS
// ======================================================================

exports.init = init;
exports.sendMessage = sendMessage;
exports.addMessageListener = addMessageListener;
