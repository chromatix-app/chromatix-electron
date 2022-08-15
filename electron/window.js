// ======================================================================
// IMPORTS
// ======================================================================

const { app, BrowserWindow } = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');

const { debounce } = require('./utils');

// ======================================================================
// OPTIONS
// ======================================================================

const isDev = process.argv[2] == '--dev';

const devRoute = 'http://localhost:3000/';
const liveRoute = 'https://chromatix.app/';

const initialRoute = isDev ? devRoute : devRoute; //liveRoute;

// ======================================================================
// STATE
// ======================================================================

let mainWindow;
let forceQuit = false;
const dev = process.env.ELECTRON_ENV === 'development' ? true : false;

app.setName('Riskable');

// ======================================================================
// WINDOW HANDLING
// ======================================================================

const createWindow = () => {
  // WINDOW STATE
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1360,
    defaultHeight: 760,
  });

  // CREATE BROWSER WINDOW.
  mainWindow = new BrowserWindow({
    // kiosk: false, //true,
    // fullscreen: isDev ? false : true,
    // show: isDev ? false : true, // hide the window on load
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
    },

    titleBarStyle: 'hiddenInset', // default hidden hiddenInset customButtonsOnHover
    frame: process.platform === 'darwin' ? false : true,
    // vibrancy: 'sidebar',

    // VIBRANCY
    // titlebar, selection, menu, popover, sidebar, header, sheet, window, hud, fullscreen-ui, tooltip, content, under-window, under-page
  });

  // WINDOW STATE
  mainWindowState.manage(mainWindow);
  // mainWindow.on('resize', debounce(mainWindowState.saveState, 500));
  // mainWindow.on('move', debounce(mainWindowState.saveState, 500));

  // LOAD APP
  loadHomePage();

  // OPEN DEV TOOLS
  // mainWindow.webContents.openDevTools();

  // OPEN NEW WINDOW IN BACKGROUND
  // mainWindow.showInactive();

  // ON CLOSE - HIDE WINDOW ON MAC
  mainWindow.on('close', (e) => {
    if (process.platform === 'darwin') {
      if (!forceQuit) {
        e.preventDefault();
        mainWindow.hide();
      }
    }
  });
};

const loadHomePage = () => {
  // mainWindow.loadFile(initialRoute);
  mainWindow.loadURL(initialRoute);
};

const quitApp = () => {
  app.quit();
};

// ======================================================================
// APP EVENTS
// ======================================================================

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  forceQuit = true;
  if (!dev) {
    var url = mainWindow.webContents.getURL().split('#');
    if (typeof url[1] !== 'undefined' && url[1]) {
      myStore.set(appStore + '_url', url[1]);
    }
  }
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// On OS X it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
app.on('activate', () => {
  mainWindow.show();
  // if (mainWindow === null) {
  //   createWindow();
  // }
});

// ======================================================================
// MAIN
// ======================================================================

const getMainWindow = () => {
  return mainWindow;
};

// ======================================================================
// EXPORTS
// ======================================================================

exports.getMainWindow = getMainWindow;
exports.loadHomePage = loadHomePage;
exports.quitApp = quitApp;
