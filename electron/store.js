let mainWindowRef = null;

const setMainWindowRef = (window) => {
  mainWindowRef = window;
};

const getMainWindowRef = () => {
  return mainWindowRef;
};

exports.setMainWindowRef = setMainWindowRef;
exports.getMainWindowRef = getMainWindowRef;
