// ======================================================================
// IMPORTS
// ======================================================================

const { ipcMain } = require('electron');

const { getMainWindowRef } = require('./store');
const { updateAppInfo, updateColorTheme, updatePlayerControls } = require('./window');

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
