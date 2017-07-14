var Mocha = require('mocha'),
  chai = require('chai'),
  chap = require('chai-as-promised'),
  Path = require('path'),
  fs = require('fs');

chai.use(chap);

function getGlobal () {
  if ('undefined' !== typeof window) {
    return window;
  }
  return global;
}

function getGlobalEntity (entityname) {
  return getGlobal()[entityname];
}

function setGlobal (name, thingy) {
  getGlobal()[name] = thingy;
}

function setGlobalAsync (name, thingy, defer) {
  var oldthingy = getGlobalEntity(name), d;
  if (oldthingy && oldthingy.destroyed && oldthingy.destroyed.attach) {
    d = q.defer();
    oldthingy.destroyed.attach(setGlobalAsync.bind(null, name, thingy, d));
    oldthingy.destroy;
    return d.promise;
  }
  if (oldthingy && lib.isFunction(oldthingy.destroy)) {
    oldthingy.destroy();
  }
  setGlobal(name, thingy);
  if (defer) {
    defer.resolve(thingy);
  } else {
    return q(thingy);
  }
}

function setGlobalSmart (name, thingy) {
  if (thingy && lib.isFunction(thingy.then)) {
    return thingy.then(setGlobalAsync.bind(null, name));
  }
  return setGlobalAsync(name, thingy);
}

setGlobal('setGlobal', setGlobal);
setGlobal('getGlobal', getGlobalEntity);
setGlobal('expect', chai.expect);

function depName(dep) {
  var sp = dep.split(':');
  if (sp.length>2) {
    return sp[1]+sp[2];
  }
  return sp[0]+sp[1];
}

function depSetter (args, dep, depindex) {
  setGlobal(depName(dep), args[depindex]);
}

function dependencySetter (dependencies) {
  var args = Array.prototype.slice.call(arguments, 1);
  dependencies.forEach(depSetter.bind(null, args));
  return q(true);
}

function loadMochaIntegration (modulename) {
  var mp;
  try {
    require(Path.join(Path.dirname(require.resolve(modulename)), 'mochaintegration'));
  } catch(e) {
    console.error('Could not load', modulename, e);
  }
}
setGlobal('loadMochaIntegration', loadMochaIntegration);

function loadClientSide (dependencies) {
  it ('Load Client Side Dependencies', function () {
    return execlib.loadDependencies('client', dependencies, dependencySetter.bind(null, dependencies));
  });
}
setGlobal('loadClientSide', loadClientSide);

function loadServerSide (dependencies) {
  it ('Load Server Side Dependencies', function () {
    return execlib.loadDependencies('server', dependencies, dependencySetter.bind(null, dependencies));
  });
}
setGlobal('loadServerSide', loadServerSide);

function initWithExecLib (execlib) {
  setGlobal('execlib', execlib);
  setGlobal('lib', execlib.lib);
  setGlobal('q', lib.q);
  setGlobal('qlib', lib.qlib);
  setGlobal('taskRegistry', execlib.execSuite.taskRegistry);
  setGlobal('setGlobal', setGlobalSmart);
}

function getMocha () {
  return Mocha;
}

function addMochaGlobals (mochalib) {
  mochalib.initWithExecLib = initWithExecLib;
  mochalib.getMocha = getMocha;
};

module.exports = addMochaGlobals;
