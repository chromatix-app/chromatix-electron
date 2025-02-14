const { app } = require('electron');

const { isUpdateAvailable, quitAndInstall } = require('./updates');
const { appVersion, isLocal } = require('./_config');

const isMac = process.platform === 'darwin';

const isDev = isLocal || process.argv.includes('--dev');

const menuTemplate = (mainWindow, prodRoute, devRoute, localRoute1, localRoute2) => {
  return [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { label: 'Version ' + appVersion, enabled: false },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              ...(isUpdateAvailable()
                ? [
                    {
                      label: 'Quit and Install Update',
                      click: () => {
                        quitAndInstall();
                      },
                    },
                  ]
                : []),
              { role: 'quit' },
            ],
          },
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac
          ? [
              { role: 'pasteAndMatchStyle' },
              { role: 'delete' },
              { role: 'selectAll' },
              { type: 'separator' },
              {
                label: 'Speech',
                submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
              },
            ]
          : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
      ],
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'History',
      submenu: [
        {
          label: 'Back',
          accelerator: 'CmdOrCtrl+[',
          click: async () => {
            mainWindow.webContents.goBack();
          },
        },
        {
          label: 'Forward',
          accelerator: 'CmdOrCtrl+]',
          click: async () => {
            mainWindow.webContents.goForward();
          },
        },
      ],
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
          : [{ role: 'close' }]),
      ],
    },
    ...(isDev
      ? [
          {
            label: 'Developer',
            submenu: [
              {
                label: 'Production',
                accelerator: 'CmdOrCtrl+1',
                click: async () => {
                  mainWindow.loadURL(prodRoute, { extraHeaders: 'pragma: no-cache\n' });
                },
              },
              {
                label: 'Develop',
                accelerator: 'CmdOrCtrl+2',
                click: async () => {
                  mainWindow.loadURL(devRoute, { extraHeaders: 'pragma: no-cache\n' });
                },
              },
              {
                label: 'Local',
                accelerator: 'CmdOrCtrl+3',
                click: async () => {
                  mainWindow.loadURL(localRoute1, { extraHeaders: 'pragma: no-cache\n' });
                },
              },
              {
                label: 'Local 2',
                accelerator: 'CmdOrCtrl+4',
                click: async () => {
                  mainWindow.loadURL(localRoute2, { extraHeaders: 'pragma: no-cache\n' });
                },
              },
            ],
          },
        ]
      : []),
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://electronjs.org');
          },
        },
      ],
    },
  ];
};

exports.menuTemplate = menuTemplate;
