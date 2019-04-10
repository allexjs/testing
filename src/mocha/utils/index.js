var _Instance;

function createUtils () {
  if (_Instance) {
    return _Instance;
  }
  _Instance = {
    findPathForModuleName: require('./modulepathfinder')
  };
  return _Instance;
}

module.exports = createUtils;
