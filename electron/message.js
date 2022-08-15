// ======================================================================
// IMPORTS
// ======================================================================

const { ipcMain } = require('electron');

const { loadHomePage, getMainWindow, quitApp } = require('./window');

// ======================================================================
// STATE
// ======================================================================

let listenerArray = {};

// ======================================================================
// LISTEN FOR INCOMING MESSAGES FROM FRONT END
// ======================================================================

const init = () => {
  ipcMain.on('message', (x, message) => {
    console.log('message received');
    console.log(message);

    let data = null;

    if (typeof message === 'object') {
      data = message.data;
      message = message.message;
    }

    if (typeof listenerArray[message] === 'function') {
      listenerArray[message](data);
    }

    switch (message) {
      case 'reload':
        loadHomePage();
        break;
      case 'quit':
        quitApp();
        break;
      case 'test-message':
        sendMessage('test-response');
        break;
      default:
        break;
    }
  });
};

// ======================================================================
// SEND MESSAGE TO FRONT END
// ======================================================================

const sendMessage = (msg) => {
  try {
    getMainWindow().webContents.send('message', msg);
  } catch (e) {
    console.log('ERROR SENDING MESSAGE');
  }
};

const addMessageListener = (string, callback) => {
  listenerArray[string] = callback;
};

// ======================================================================
// EXPORTS
// ======================================================================

exports.init = init;
exports.sendMessage = sendMessage;
exports.addMessageListener = addMessageListener;
