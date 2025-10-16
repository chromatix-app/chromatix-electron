// ======================================================================
// IMPORTS
// ======================================================================

const { app, BrowserWindow, Menu, shell, nativeImage } = require('electron');
const windowStateKeeper = require('electron-window-state');
// const dns = require('dns');
const fs = require('fs');
const https = require('https');
const path = require('path');

const { menuTemplate } = require('./menu');
const { getMainWindowRef, setMainWindowRef, getAllowInsecure } = require('./store');
const { quitAndInstall, setUpdateMenuCallback } = require('./updates');

// const { debounce } = require('./utils');

// ======================================================================
// OPTIONS
// ======================================================================

const isDev = process.argv.includes('--dev');

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

let webAppVersion;
let forceQuit = false;

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
  const newMainWindowRef = new BrowserWindow({
    // kiosk: false, //true,
    // fullscreen: isDev ? false : true,
    // show: isDev ? false : true, // hide the window on load
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 1024,
    minHeight: 600,
    backgroundColor: '#80878d',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: false,
      sandbox: false,
      // webSecurity: false, // tested this to allow insecure jellyfin servers
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

    ...(process.platform === 'win32' && {
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

    // LINUX OPTIONS
    ...(process.platform === 'linux' && {
      transparent: true,
      autoHideMenuBar: true
    }),
  });

  // EXAMPLE: CHANGE TITLE BAR COLOURS

  // WINDOW STATE
  mainWindowState.manage(newMainWindowRef);
  // newMainWindowRef.on('resize', debounce(mainWindowState.saveState, 500));
  // newMainWindowRef.on('move', debounce(mainWindowState.saveState, 500));

  // SWIPE GESTURES
  newMainWindowRef.on('swipe', (event, direction) => {
    if (direction === 'left') {
      newMainWindowRef.webContents.goBack();
    } else if (direction === 'right') {
      newMainWindowRef.webContents.goForward();
    }
  });

  // OPEN EXTERNAL LINKS IN BROWSER
  newMainWindowRef.webContents.setWindowOpenHandler(({ url }) => {
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
  // newMainWindowRef.webContents.on('will-navigate', (event, url) => {
  //   if (!url.includes('https://chromatix')) {
  //     event.preventDefault();
  //     shell.openExternal(url);
  //   }
  // });

  // LOAD APP
  loadHomePage();

  // OPEN DEV TOOLS
  // newMainWindowRef.webContents.openDevTools();

  // OPEN NEW WINDOW IN BACKGROUND
  // newMainWindowRef.showInactive();

  // ON CLOSE - HIDE WINDOW ON MAC
  newMainWindowRef.on('close', (e) => {
    if (process.platform === 'darwin') {
      if (!forceQuit) {
        e.preventDefault();
        newMainWindowRef.hide();
      }
    }
  });

  setMainWindowRef(newMainWindowRef);
};

// NOTE: using DNS resolution as an offline check may not be reliable

// const checkInternetConnection = () => {
//   return new Promise((resolve, reject) => {
//     let resolved = false;
//     let counter = 0;

//     const dnsCheckRoutes = ['chromatix.app', '1.1.1.1', '8.8.8.8', '9.9.9.9', '208.67.222.222'];

//     dnsCheckRoutes.forEach((dnsCheckRoute) => {
//       dns.resolve(dnsCheckRoute, (err) => {
//         counter++;
//         if (!err && !resolved) {
//           resolved = true;
//           resolve(true);
//         } else if (counter === dnsCheckRoutes.length && !resolved) {
//           resolve(false);
//         }
//       });
//     });

//     // Max wait time for DNS resolution
//     setTimeout(() => {
//       if (!resolved) {
//         resolve(false);
//       }
//     }, 5000);
//   });
// };

const checkInternetConnection = () => {
  return new Promise((resolve) => {
    let resolved = false;

    // Use multiple reliable endpoints
    const checkUrls = [
      'https://chromatix.app',
      'https://www.google.com',
      'https://www.cloudflare.com',
      'https://www.apple.com',
      'https://www.microsoft.com',
    ];

    // Try each URL with HEAD request
    checkUrls.forEach((url) => {
      if (resolved) return;

      const options = new URL(url);
      options.method = 'HEAD';
      options.timeout = 3000;

      const req = https.request(options, (res) => {
        if (!resolved && res.statusCode >= 200 && res.statusCode < 400) {
          resolved = true;
          resolve(true);
        }
        req.destroy();
      });

      req.on('error', () => {});

      req.on('timeout', () => {
        req.destroy();
      });

      // Don't forget to end the request since we're using request() not get()
      req.end();
    });

    // Max wait time for all requests
    setTimeout(() => {
      if (!resolved) {
        resolve(false);
      }
    }, 6000);
  });
};

const loadHomePage = () => {
  checkInternetConnection().then((connected) => {
    if (connected) {
      // internet connection exists
      getMainWindowRef().loadURL(initialRoute, { extraHeaders: 'pragma: no-cache\n' });
    } else {
      // no internet connection
      getMainWindowRef().loadFile(offlineRoute);
      // retry loading home page after 5 seconds
      setTimeout(loadHomePage, 5000);
    }
  });
};

const quitApp = () => {
  app.quit();
};

if (process.platform === 'linux') {
  app.commandLine.appendSwitch('enable-features', 'FluentOverlayScrollbar');
}

// ======================================================================
// APP MENU
// ======================================================================

const setMainMenu = () => {
  const newMenu = menuTemplate(
    getMainWindowRef(),
    webAppVersion,
    prodRoute,
    devRoute,
    localRoute1,
    localRoute2,
    setMainMenu
  );
  Menu.setApplicationMenu(Menu.buildFromTemplate(newMenu));
  sendMessage(newMenu, 'updateMenu');
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

// Handle certificate errors, if the user toggles this option.
// This is to enable connecting to servers (e.g. Jellyfin) with self-signed certificates,
// or even no certificates.
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  event.preventDefault();
  callback(getAllowInsecure());
});

app.on('before-quit', () => {
  forceQuit = true;

  // NOTE: I'm not sure why this code was here or what it does.
  // if (!isDev) {
  //   var url = getMainWindowRef().webContents.getURL().split('#');
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
  getMainWindowRef().show();
  // if (getMainWindowRef() === null) {
  //   createWindow();
  // }
});

// ======================================================================
// APP INFO
// ======================================================================

const updateAppInfo = (message) => {
  webAppVersion = message.version;
  setMainMenu();
};

// ======================================================================
// COLOR THEMING
// ======================================================================

const updateColorTheme = (message) => {
  if (process.platform !== 'darwin') {
    try {
      getMainWindowRef().setTitleBarOverlay({
        color: message.background,
        symbolColor: message.primary, // symbol color here
        height: 30,
      });
    } catch (e) {}
  }
};

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

    const mainWindowRef = getMainWindowRef();

    if (data.status === 'disabled') {
      mainWindowRef.setThumbarButtons([]);
      mainWindowRef.setTitle('Chromatix');
    } else {
      const isPlaying = data.status === 'playing';

      mainWindowRef.setThumbarButtons([
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
        mainWindowRef.setTitle(titleString);
      } else {
        mainWindowRef.setTitle('Chromatix');
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

const sendMessage = (msg, channel = 'message') => {
  try {
    const messageToSend = typeof msg === 'object' ? JSON.stringify(msg) : msg;
    getMainWindowRef().webContents.send(channel, messageToSend);
  } catch (e) {
    console.log('ERROR SENDING MESSAGE');
  }
};

// ======================================================================
// EXPORTS
// ======================================================================

exports.loadHomePage = loadHomePage;
exports.quitApp = quitApp;
exports.setMainMenu = setMainMenu;
exports.updateAppInfo = updateAppInfo;
exports.updateColorTheme = updateColorTheme;
exports.updatePlayerControls = updatePlayerControls;
