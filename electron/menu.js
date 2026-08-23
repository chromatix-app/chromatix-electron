const { app } = require('electron');

const { appVersion, isLocal } = require('./_config');
const { getAllowInsecure, setAllowInsecure } = require('./store');
const { isUpdateAvailable, quitAndInstall } = require('./updates');

const isMac = process.platform === 'darwin';

const isDev = isLocal || process.argv.includes('--dev');

const menuTemplate = (mainWindowRef, webAppVersion, prodRoute, devRoute, localRoute1, localRoute2, updateCallback) => {
  return [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { label: 'Version ' + appVersion, enabled: false },
              ...(webAppVersion ? [{ label: 'Web App Version ' + webAppVersion, enabled: false }] : []),
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
            mainWindowRef.webContents.goBack();
          },
        },
        {
          label: 'Forward',
          accelerator: 'CmdOrCtrl+]',
          click: async () => {
            mainWindowRef.webContents.goForward();
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
                  mainWindowRef.loadURL(prodRoute, { extraHeaders: 'pragma: no-cache\n' });
                },
              },
              {
                label: 'Develop',
                accelerator: 'CmdOrCtrl+2',
                click: async () => {
                  mainWindowRef.loadURL(devRoute, { extraHeaders: 'pragma: no-cache\n' });
                },
              },
              {
                label: 'Local',
                accelerator: 'CmdOrCtrl+3',
                click: async () => {
                  mainWindowRef.loadURL(localRoute1, { extraHeaders: 'pragma: no-cache\n' });
                },
              },
              {
                label: 'Local 2',
                accelerator: 'CmdOrCtrl+4',
                click: async () => {
                  mainWindowRef.loadURL(localRoute2, { extraHeaders: 'pragma: no-cache\n' });
                },
              },
            ],
          },
        ]
      : []),
    {
      label: 'Advanced',
      submenu: [
        {
          label: 'Allow Insecure Connections (Not Recommended)',
          type: 'checkbox',
          checked: getAllowInsecure(),
          click: (menuItem) => {
            setAllowInsecure(menuItem.checked);
            updateCallback();
          },
        },
      ],
    },
    ...(!isMac && isUpdateAvailable()
      ? [
          {
            label: 'Updates',
            submenu: [
              {
                label: 'Quit and Install Update',
                webAction: 'quitAndInstall',
                click: () => {
                  quitAndInstall();
                },
              },
            ],
          },
        ]
      : []),
  ];
};

exports.menuTemplate = menuTemplate;
