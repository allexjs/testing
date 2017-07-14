function addFindSinkFunctionality(mochalib) {
  'use strict';

  function findMasterPid (findsinkhash) {
    var d = q.defer();
    taskRegistry.run('findMasterPid', {
      cb: doFindSink.bind(null, d, findsinkhash)
    });
    return d.promise;
  }

  function sinkname (findsinkhash) {
    var sinkname;
    if (findsinkhash.sinkalias) {
      return findsinkhash.sinkalias;
    }
    sinkname = findsinkhash.sinkname;
    if (lib.isArray(sinkname)) {
      return sinkname[sinkname.length-1];
    }
    return sinkname;
  }

  function doFindSink (d, findsinkhash) {
    var fso = {task: null},
      to = {
      sinkname: findsinkhash.sinkname,
      identity: findsinkhash.identity || {name:'user', role:'user'},
      onSink: function (sink) {
        if (fso && fso.task) {
          fso.task.destroy();
          fso.task = null;
        }
        fso = null;
        if (d) {
          d.resolve(sink);
        }
        d = null;
      }
    };
    taskRegistry.run('findSink', to);
    return setGlobal(sinkname(findsinkhash), d.promise);
  }

  function findSink (findsinkhash) {
    if ('undefined' === typeof master) {
      return execlib.loadDependencies('client', ['allex:master'], findMasterPid.bind(null, findsinkhash));
    }
    return findMasterPid(findsinkhash);
  }

  function findSinkIt (findsinkhash) {
    it('findSink '+sinkname(findsinkhash), findSink.bind(null, findsinkhash));
  }

  setGlobal('findSink', findSink);
  setGlobal('findSinkIt', findSinkIt);
}

module.exports = addFindSinkFunctionality;
