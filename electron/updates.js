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
  // sendMessage('autoupdate - error');
  // log.error('autoupdate - error', error);
  console.log('autoupdate - error');
});

autoUpdater.on('checking-for-update', (progressObj) => {
  // sendMessage('autoupdate - checking-for-update');
  log.info('autoupdate - checking-for-update');
  console.log('autoupdate - checking-for-update');
});

autoUpdater.on('update-available', (info) => {
  // sendMessage('autoupdate - update-available');
  log.info('autoupdate - update-available', info);
  console.log('autoupdate - update-available', info);
});

autoUpdater.on('update-not-available', (info) => {
  // sendMessage('autoupdate - update-not-available');
  log.info('autoupdate - update-not-available', info);
  console.log('autoupdate - update-not-available', info);
});

autoUpdater.on('download-progress', (progressObj) => {
  // sendMessage('autoupdate - download-progress ' + Math.floor(progressObj.percent) + '%');
  log.info('autoupdate - download-progress ' + Math.floor(progressObj.percent) + '%');
  console.log('autoupdate - download-progress ' + Math.floor(progressObj.percent) + '%');
});

autoUpdater.on('update-available', (info) => {
  // sendMessage('autoupdate - update-available');
  log.info('autoupdate - update-available');
  console.log('autoupdate - update-available');
});

autoUpdater.on('update-not-available', (info) => {
  // sendMessage('autoupdate - update-not-available');
  log.info('autoupdate - update-not-available');
  console.log('autoupdate - update-not-available');
});

autoUpdater.on('update-downloaded', (info) => {
  // sendMessage('autoupdate - update-downloaded');
  log.info('autoupdate - update-downloaded');
  console.log('autoupdate - update-downloaded');
  updateAvailable = true;
  // setMainMenu();
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

app.on('ready', function () {
  // sendMessage('autoupdate - ready');
  log.info('autoupdate - ready');
  console.log('autoupdate - ready');
  autoUpdater.checkForUpdatesAndNotify();
});

// setTimeout(function () {
//   updateAvailable = true;
//   setMainMenu();
// }, 5000);

exports.quitAndInstall = quitAndInstall;
exports.updateAvailable = updateAvailable;
