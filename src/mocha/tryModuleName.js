function createTryModuleName (mochalib) {
  'use strict';

  var _npmlinkedpaths = [];

  process.on('beforeExit', function () {
    _npmlinkedpaths.forEach(npmunlink);
    _npmlinkedpaths = [];
  });


  function npmunlink (path) {
    var cwd = process.cwd();
    try {
      process.chdir(path);
    }
    catch (e) {
      console.error('Could not chdir to '+path+' to npm unlink the missing module');
      //no throw
    }
    try {
      require('child_process').execSync('npm unlink');
    } catch(e) {
      console.error('Could not run npm unlink in '+path);
      //no throw
    }
    process.chdir(cwd);
  }
  function npmlink (path) {
    var cwd = process.cwd();
    try {
      process.chdir(path);
    }
    catch (e) {
      throw new Error('Could not chdir to '+path+' to npm link the missing module');
    }
    try {
      require('child_process').execSync('npm --no-package-lock link');
    } catch(e) {
      throw new Error('Could not run npm link in '+path);
    }
    process.chdir(cwd);
  }

  function buildModulePath (pathtomodule, modulename) {
    var Node = require('./utils/nodehelpers')(),
      Path = Node.Path;
    if (lib.isArray(pathtomodule)) {
      pathtomodule = Path.join.apply(Path, pathtomodule);
    }
    return Path.join(pathtomodule, modulename);
  }

  function tryModuleName (modulename, pathtomodule, attempt) {
    var path;
    attempt = attempt || 0;
    try {
      return modulename == require.resolve(modulename);
    } catch (e) {
      if (attempt) {
        throw e;
      }
      if (!(e.code==='MODULE_NOT_FOUND' && e.message.indexOf(modulename) >= 0)) {
        throw e;
      }
      if (!pathtomodule) {
        throw e;
      }
      path = buildModulePath(pathtomodule, modulename);
      console.log('Going to npm link ', modulename, 'in', path);
      npmlink(path);
      _npmlinkedpaths.push(path);
      return tryModuleName(modulename, path, attempt+1);
    }
  }
  setGlobal('tryModuleName', tryModuleName);
}

module.exports = createTryModuleName;
