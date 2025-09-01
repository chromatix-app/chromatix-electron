let mainWindowRef = null;
let allowInsecure = false;

const setMainWindowRef = (window) => {
  mainWindowRef = window;
};

const getMainWindowRef = () => {
  return mainWindowRef;
};

const setAllowInsecure = (value) => {
  allowInsecure = value;
};

const getAllowInsecure = () => {
  return allowInsecure;
};

exports.setMainWindowRef = setMainWindowRef;
exports.getMainWindowRef = getMainWindowRef;
exports.setAllowInsecure = setAllowInsecure;
exports.getAllowInsecure = getAllowInsecure;
