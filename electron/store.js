const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const storeFilePath = path.join(app.getPath('userData'), 'chromatix-settings.json');

let mainWindowRef = null;
let allowInsecure = readStore().allowInsecure || false;

const setMainWindowRef = (window) => {
  mainWindowRef = window;
};

const getMainWindowRef = () => {
  return mainWindowRef;
};

const setAllowInsecure = (value) => {
  allowInsecure = value;
  updateStore({ allowInsecure: value });
};

const toggleAllowInsecure = () => {
  setAllowInsecure(!allowInsecure);
};

const getAllowInsecure = () => {
  return allowInsecure;
};

// HELPER FUNCTIONS

function readStore() {
  try {
    if (fs.existsSync(storeFilePath)) {
      return JSON.parse(fs.readFileSync(storeFilePath, 'utf8'));
    }
  } catch {}
  return {};
}

function writeStore(data) {
  try {
    fs.writeFileSync(storeFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch {}
}

function updateStore(updates) {
  const store = readStore();
  Object.assign(store, updates);
  writeStore(store);
}

// EXPORTS

exports.setMainWindowRef = setMainWindowRef;
exports.getMainWindowRef = getMainWindowRef;
exports.setAllowInsecure = setAllowInsecure;
exports.getAllowInsecure = getAllowInsecure;
exports.toggleAllowInsecure = toggleAllowInsecure;
// exports.updateStore = updateStore;
