var _Instance;

function createNodeHelpers () {
  if (_Instance) {
    return _Instance;
  }
  _Instance = require('allex_nodehelpersserverruntimelib')(execlib.lib);
  return _Instance;
}

module.exports = createNodeHelpers;
