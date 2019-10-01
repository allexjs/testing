function createStartService (mochalib) {
  'use strict';
  /*
   * prophash:
   * {
   *   modulename: String,
   *   instancename: String,
   *   prophash: Object
   *   pathtomodule: String|Array
   * }
   */

  function startService (prophash) {
    tryModuleName(prophash.modulename, prophash.pathtomodule, 0);
    return execlib.execSuite.start({
      service: {
        modulename: prophash.modulename,
        instancename: prophash.instancename,
        prophash: prophash.prophash
      }
    })
  }
  setGlobal('startService', startService);
}

module.exports = createStartService;
