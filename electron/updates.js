// ======================================================================
// IMPORTS
// ======================================================================

const log = require('electron-log');
const { app } = require('electron');
const { autoUpdater } = require('electron-updater');

// ======================================================================
// HANDLE UPDATES
// ======================================================================

autoUpdater.logger = console;
autoUpdater.autoInstallOnAppQuit = true;

let updateAvailable = false;

autoUpdater.on('error', (error) => {
  console.log('autoupdate - error');
  sendMessage('autoupdate - error');
  log.error('autoupdate - error');
  log.error(error);
});
autoUpdater.on('checking-for-update', (progressObj) => {
  console.log('autoupdate - checking-for-update');
  sendMessage('autoupdate - checking-for-update');
});
autoUpdater.on('download-progress', (progressObj) => {
  console.log('autoupdate - download-progress ' + Math.floor(progressObj.percent) + '%');
  sendMessage('autoupdate - download-progress ' + Math.floor(progressObj.percent) + '%');
});
autoUpdater.on('update-available', (info) => {
  console.log('autoupdate - update-available');
  sendMessage('autoupdate - update-available');
  log.warn('autoupdate - update-available');
});
autoUpdater.on('update-not-available', (info) => {
  console.log('autoupdate - update-not-available');
  sendMessage('autoupdate - update-not-available');
});
autoUpdater.on('update-downloaded', (info) => {
  console.log('autoupdate - update-downloaded');
  sendMessage('autoupdate - update-downloaded');
  log.warn('autoupdate - update-downloaded');
  updateAvailable = true;
  appState.updateAvailable = true;
  setMainMenu();
});

const quitAndInstall = () => {
  try {
    autoUpdater.quitAndInstall();
    app.quit();
  } catch (e) {
    console.log('autoupdate - unable to quit and install');
    log.error('autoupdate - unable to quit and install');
    app.quit();
  }
};

app.on('ready', function () {
  autoUpdater.checkForUpdatesAndNotify();
});

exports.quitAndInstall = quitAndInstall;
exports.updateAvailable = updateAvailable;
