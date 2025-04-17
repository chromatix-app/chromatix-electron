// ======================================================================
// IMPORTS
// ======================================================================

const { app } = require('electron');
const { autoUpdater } = require('electron-updater');
// const log = require('electron-log');

const { getMainWindowRef } = require('./store');

// ======================================================================
// HANDLE UPDATES
// ======================================================================

autoUpdater.logger = console;
autoUpdater.autoInstallOnAppQuit = true;

let updateAvailable = false;
let updateMenuCallback = () => {};

autoUpdater.on('error', (error) => {
  console.log('autoupdate - error');
  sendMessage('autoupdate - error');
  // log.error('autoupdate - error', error);
});

autoUpdater.on('checking-for-update', (progressObj) => {
  console.log('autoupdate - checking-for-update');
  sendMessage('autoupdate - checking-for-update');
  // log.info('autoupdate - checking-for-update');
});

autoUpdater.on('download-progress', (progressObj) => {
  console.log('autoupdate - download-progress ' + Math.floor(progressObj.percent) + '%');
  sendMessage('autoupdate - download-progress ' + Math.floor(progressObj.percent) + '%');
  // log.info('autoupdate - download-progress ' + Math.floor(progressObj.percent) + '%');
});

autoUpdater.on('update-available', (info) => {
  console.log('autoupdate - update-available', info);
  sendMessage('autoupdate - update-available');
  // log.info('autoupdate - update-available', info);
});

autoUpdater.on('update-not-available', (info) => {
  console.log('autoupdate - update-not-available');
  sendMessage('autoupdate - update-not-available');
  // log.info('autoupdate - update-not-available');
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('autoupdate - update-downloaded');
  sendMessage('autoupdate - update-downloaded');
  // log.info('autoupdate - update-downloaded');
  updateAvailable = true;
  updateMenuCallback();
});

const quitAndInstall = () => {
  try {
    autoUpdater.quitAndInstall();
    app.quit();
  } catch (e) {
    // log.error('autoupdate - unable to quit and install');
    console.log('autoupdate - unable to quit and install');
    app.quit();
  }
};

const isUpdateAvailable = () => {
  return updateAvailable;
};

const setUpdateMenuCallback = (callback) => {
  updateMenuCallback = callback;
};

app.on('ready', function () {
  setTimeout(function () {
    console.log('autoupdate - ready');
    sendMessage('autoupdate - ready');
    // log.info('autoupdate - ready');
    autoUpdater.checkForUpdatesAndNotify();
  }, 1000);
});

// ======================================================================
// HELPERS
// ======================================================================

const sendMessage = (msg) => {
  try {
    getMainWindowRef().webContents.send('message', msg);
  } catch (e) {
    console.log('ERROR SENDING MESSAGE');
  }
};

// ======================================================================
// EXPORTS
// ======================================================================

exports.isUpdateAvailable = isUpdateAvailable;
exports.quitAndInstall = quitAndInstall;
exports.setUpdateMenuCallback = setUpdateMenuCallback;
