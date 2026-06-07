// ======================================================================
// IMPORTS
// ======================================================================

const { ipcMain } = require('electron');

const { getMainWindowRef, toggleAllowInsecure } = require('./store');
const { setMainMenu, updateAppInfo, updateColorTheme, updatePlayerControls } = require('./window');
const { quitAndInstall } = require('./updates');

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
    const mainWindow = getMainWindowRef();
    mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() + 1);
  });
  ipcMain.on('zoom-out', () => {
    const mainWindow = getMainWindowRef();
    mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() - 1);
  });
  ipcMain.on('togglefullscreen', () => {
    const mainWindow = getMainWindowRef();
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
  });

  ipcMain.on('minimize', () => {
    getMainWindowRef().minimize();
  });
  ipcMain.on('zoom', () => {
    const mainWindow = getMainWindowRef();
    if (mainWindow?.isMaximized()) {
      mainWindow?.unmaximize();
    } else {
      mainWindow?.maximize();
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

  ipcMain.on('quit-and-install', () => {
    quitAndInstall();
  });
};

// ======================================================================
// SEND MESSAGE TO FRONT END
// ======================================================================

const sendMessage = (msg) => {
  try {
    getMainWindowRef().webContents.send('message', msg);
  } catch (_error) {
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
