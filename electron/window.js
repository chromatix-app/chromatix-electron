// ======================================================================
// IMPORTS
// ======================================================================

const { app, BrowserWindow, Menu } = require('electron');
const windowStateKeeper = require('electron-window-state');
const dns = require('dns');
const path = require('path');

const { menuTemplate } = require('./menu');
const { quitAndInstall, setUpdateMenuCallback } = require('./updates');

// const { debounce } = require('./utils');

// ======================================================================
// OPTIONS
// ======================================================================

const isDev = process.argv.includes('--dev');

const appName = 'Chromatix';

const dnsCheckRoutes = ['chromatix.app', '1.1.1.1', '8.8.8.8', '9.9.9.9', '208.67.222.222'];

const prodRoute = 'https://chromatix.app/';
const devRoute = 'https://chromatix.vercel.app/';
const localRoute1 = 'http://localhost:3000/';
const localRoute2 = 'http://192.168.1.103:3000/';

const offlineRoute = path.join(__dirname, '../offline/index.html');

const initialRoute = isDev ? localRoute1 : prodRoute;

// ======================================================================
// STATE
// ======================================================================

let mainWindow;
let forceQuit = false;

app.setName(appName);

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
    minWidth: 1024,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
    },
    quitAndInstall: quitAndInstall,

    // MAC OPTIONS

    ...(process.platform === 'darwin' && {
      frame: false,
      autoHideMenuBar: true,
      titleBarStyle: 'hiddenInset',
      trafficLightPosition: { x: 16, y: 21 },
      // vibrancy: 'sidebar',
    }),

    // WINDOWS OPTIONS

    ...(process.platform !== 'darwin' && {
      frame: true,
      autoHideMenuBar: false,
      // titleBarStyle: 'default',
      titleBarStyle: 'hidden',
      titleBarOverlay: {
        color: '#021c27',
        symbolColor: '#fff',
        height: 32,
      },
    }),
  });

  // EXAMPLE: CHANGE TITLE BAR COLOURS

  // setTimeout(function () {
  //   mainWindow.setTitleBarOverlay({
  //     color: '#257394',
  //     symbolColor: '#fff', // symbol color here
  //     height: 30,
  //   });
  // }, 5000);

  // WINDOW STATE
  mainWindowState.manage(mainWindow);
  // mainWindow.on('resize', debounce(mainWindowState.saveState, 500));
  // mainWindow.on('move', debounce(mainWindowState.saveState, 500));

  // SWIPE GESTURES
  mainWindow.on('swipe', (event, direction) => {
    if (direction === 'left') {
      mainWindow.webContents.goBack();
    } else if (direction === 'right') {
      mainWindow.webContents.goForward();
    }
  });

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

const checkInternetConnection = () => {
  return new Promise((resolve, reject) => {
    let resolved = false;
    let counter = 0;

    dnsCheckRoutes.forEach((dnsCheckRoute) => {
      dns.resolve(dnsCheckRoute, (err) => {
        counter++;
        if (!err && !resolved) {
          resolved = true;
          resolve(true);
        } else if (counter === dnsCheckRoutes.length && !resolved) {
          resolve(false);
        }
      });
    });

    // Max wait time for DNS resolution
    setTimeout(() => {
      if (!resolved) {
        resolve(false);
      }
    }, 5000);
  });
};

const loadHomePage = () => {
  checkInternetConnection().then((connected) => {
    if (connected) {
      // internet connection exists
      mainWindow.loadURL(initialRoute, { extraHeaders: 'pragma: no-cache\n' });
    } else {
      // no internet connection
      mainWindow.loadFile(offlineRoute);
      // retry loading home page after 5 seconds
      setTimeout(loadHomePage, 5000);
    }
  });
};

const quitApp = () => {
  app.quit();
};

// ======================================================================
// APP MENU
// ======================================================================

const setMainMenu = () => {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate(menuTemplate(mainWindow, prodRoute, devRoute, localRoute1, localRoute2))
  );
};

setUpdateMenuCallback(setMainMenu);

// ======================================================================
// APP EVENTS
// ======================================================================

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  setMainMenu();

  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  forceQuit = true;

  // NOTE: I'm not sure why this code was here or what it does.
  // if (!isDev) {
  //   var url = mainWindow.webContents.getURL().split('#');
  //   if (typeof url[1] !== 'undefined' && url[1]) {
  //     myStore.set(appStore + '_url', url[1]);
  //   }
  // }
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
exports.setMainMenu = setMainMenu;
exports.quitApp = quitApp;
