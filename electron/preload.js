// ======================================================================
// IMPORTS
// ======================================================================

// const { contextBridge } = require('electron');

const { appVersion, buildDate } = require('./_config');

// ======================================================================
// DISPLAY SPECS ON FRONT END
// ======================================================================

// // All of the Node.js APIs are available in the preload process.
// // It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector);
//     if (element) element.innerText = text;
//   };
//   for (const dependency of ['chrome', 'node', 'electron']) {
//     replaceText(`${dependency}-version`, process.versions[dependency]);
//   }
// });

// ======================================================================
// MESSAGING BETWEEN FRONT AND BACK END
// ======================================================================

window.isElectron = true;
window.electronProcess = {
  appVersion: appVersion,
  buildDate: buildDate,
  platform: process.platform, // === 'darwin' ? 'mac' : 'win',
};
window.ipcRenderer = require('electron').ipcRenderer;
