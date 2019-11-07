function createStartService (mochalib) {
  'use strict';
  /*
   * propertyhash:
   * {
   *   modulename: String,
   *   instancename: String,
   *   propertyhash: Object
   *   pathtomodule: String|Array
   * }
   */

  function startService (propertyhash) {
    tryModuleName(propertyhash.modulename, propertyhash.pathtomodule, 0);
    return execlib.execSuite.start({
      service: {
        modulename: propertyhash.modulename,
        instancename: propertyhash.instancename,
        propertyhash: propertyhash.propertyhash
      }
    })
  }
  setGlobal('startService', startService);
}

module.exports = createStartService;
