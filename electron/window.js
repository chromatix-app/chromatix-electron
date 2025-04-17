// ======================================================================
// IMPORTS
// ======================================================================

const { app, BrowserWindow, Menu, shell, nativeImage } = require('electron');
const windowStateKeeper = require('electron-window-state');
const dns = require('dns');
const path = require('path');
const fs = require('fs');

const { menuTemplate } = require('./menu');
const { quitAndInstall, setUpdateMenuCallback } = require('./updates');

// const { debounce } = require('./utils');

// ======================================================================
// OPTIONS
// ======================================================================

const isDev = process.argv.includes('--dev');

const appName = 'Chromatix';

const dnsCheckRoutes = ['chromatix.app', '1.1.1.1', '8.8.8.8', '9.9.9.9', '208.67.222.222'];

const prodRoute = 'https://chromatix.app';
const devRoute = 'https://chromatix.vercel.app';
const localRoute1 = 'http://localhost:3000';
const localRoute2 = 'http://192.168.1.200:3000';

const offlineRoute = path.join(__dirname, '../offline/index.html');

const initialRoute = isDev ? localRoute1 : prodRoute;

const internalRoutes = [prodRoute, devRoute, localRoute1, localRoute2];
const externalRoutes = ['//accounts.google', '//app.plex', '//appleid.apple'];

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
      sandbox: false,
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
        height: 30,
      },
    }),
  });

  // EXAMPLE: CHANGE TITLE BAR COLOURS

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

  // OPEN EXTERNAL LINKS IN BROWSER
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Keep internal routes in-app and prevent secondary windows
    if (internalRoutes.some((route) => url.includes(route))) {
      // console.log(111);
      return { action: 'deny' };
    }
    // Allow certain external routes to open in-app as default
    else if (externalRoutes.some((route) => url.includes(route))) {
      // console.log(222);
      return { action: 'allow' };
    }
    // Open all other external URLs in the default browser
    else {
      // console.log(333);
      shell.openExternal(url);
      return { action: 'deny' };
    }
  });

  // // OPTIONALLY HANDLE <A> LINK CLICKS INSIDE THE APP
  // mainWindow.webContents.on('will-navigate', (event, url) => {
  //   if (!url.includes('https://chromatix')) {
  //     event.preventDefault();
  //     shell.openExternal(url);
  //   }
  // });

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

const setColorTheme = (message) => {
  if (process.platform !== 'darwin') {
    try {
      mainWindow.setTitleBarOverlay({
        color: message.background,
        symbolColor: message.primary, // symbol color here
        height: 30,
      });
    } catch (e) {}
  }
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
  loadAllIcons();

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
// MEDIA CONTROLS (WINDOWS ONLY)
// ======================================================================

const updatePlayerControls = (data) => {
  if (process.platform !== 'darwin') {
    if (!playIcon || !pauseIcon || !prevIcon || !nextIcon) {
      setTimeout(() => {
        updatePlayerControls(data);
      }, 1000);
      return;
    }

    if (data.status === 'disabled') {
      mainWindow.setThumbarButtons([]);
      mainWindow.setTitle('Chromatix');
    } else {
      const isPlaying = data.status === 'playing';

      mainWindow.setThumbarButtons([
        {
          tooltip: 'Previous',
          icon: prevIcon,
          click: () => {
            sendMessage('action-media-previous');
          },
        },
        {
          tooltip: isPlaying ? 'Pause' : 'Play',
          icon: isPlaying ? pauseIcon : playIcon,
          click: () => {
            if (isPlaying) {
              sendMessage('action-media-pause');
            } else {
              sendMessage('action-media-play');
            }
          },
        },
        {
          tooltip: 'Next',
          icon: nextIcon,
          click: () => {
            sendMessage('action-media-next');
          },
        },
      ]);

      // Set the thumbnail toolbar tooltip
      const titleArray = [];
      if (data.artist) {
        titleArray.push(data.artist);
      }
      if (data.title) {
        titleArray.push(data.title);
      }
      if (titleArray.length > 0) {
        const titleString = titleArray.join(' - ');
        mainWindow.setTitle(titleString);
      } else {
        mainWindow.setTitle('Chromatix');
      }
    }
  }
};

// ======================================================================
// LOAD ICONS (FOR WINDOWS MEDIA CONTROLS)
// ======================================================================

let playIcon;
let pauseIcon;
let prevIcon;
let nextIcon;

const loadAllIcons = () => {
  if (process.platform !== 'darwin') {
    try {
      // Load icons
      playIcon = loadPngIcon('play.png');
      pauseIcon = loadPngIcon('pause.png');
      prevIcon = loadPngIcon('previous.png');
      nextIcon = loadPngIcon('next.png');

      // Resize icons to fit taskbar requirements (typically 16x16)
      // playIcon = playIcon.resize({ width: 16, height: 16 });
      // pauseIcon = pauseIcon.resize({ width: 16, height: 16 });
      // prevIcon = prevIcon.resize({ width: 16, height: 16 });
      // nextIcon = nextIcon.resize({ width: 16, height: 16 });
    } catch (e) {
      sendMessage('Error loading icons: ' + e);
    }
  }
};

const loadPngIcon = (filename) => {
  try {
    const pngPath = path.join(__dirname, '../assets', 'icons', filename);
    if (!fs.existsSync(pngPath)) {
      sendMessage(`Error: icon file not found at: ${pngPath}`);
      return null;
    }
    return nativeImage.createFromPath(pngPath);
  } catch (e) {
    sendMessage(`Error loading PNG icon ${filename}: ${e}`);
    return null;
  }
};

// const loadSvgIcon = (filename) => {
//   try {
//     const svgPath = path.join(__dirname, '../assets', 'icons', filename);
//     sendMessage(`Attempting to load icon from: ${svgPath}`);

//     if (!fs.existsSync(svgPath)) {
//       sendMessage(`Icon file not found at: ${svgPath}`);
//       return null;
//     }

//     const svgContent = fs.readFileSync(svgPath, 'utf8');
//     sendMessage(`Successfully loaded icon: ${filename}`);
//     return nativeImage.createFromDataURL(`data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`);
//   } catch (e) {
//     sendMessage('Error loading SVG icon ${filename}: ' + e);
//     return null;
//   }
// };

// ======================================================================
// HELPERS
// ======================================================================

const sendMessage = (msg) => {
  try {
    mainWindow.webContents.send('message', msg);
  } catch (e) {
    console.log('ERROR SENDING MESSAGE');
  }
};

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
exports.setColorTheme = setColorTheme;
exports.setMainMenu = setMainMenu;
exports.updatePlayerControls = updatePlayerControls;
