var Node, Fs, Path;

function lookUpTheTreeNodeModules (modulename) {
  var ret, prevcwd = process.cwd(), currcwd;
  process.chdir('..');
  currcwd = process.cwd();
  if (currcwd === prevcwd) {
    return null;
  }
  if (
    Fs.dirExists('node_modules') &&
    Fs.dirExists(Path.join('node_modules', modulename)) &&
    Fs.fileExists(Path.join('node_modules', modulename, 'package.json'))
  ) {
      return Path.join(currcwd, 'node_modules', modulename);
  }
  return lookUpTheTreeNodeModules(modulename);
}
function tryResolve (modulename) {
  try {
    return ;
  }
  catch(ignore) {return null;}
}
function findPathForModuleName(modulename) {
  Node = require('./nodehelpers')();
  Fs = Node.Fs;
  Path = Node.Path;
  var modulepath, cwd;
  try {
    modulepath = require.resolve(modulename);
  } catch(ignore) {}
  if (!modulepath) {
    cwd = process.cwd();
    modulepath = lookUpTheTreeNodeModules(modulename);
    process.chdir(cwd);
  }
  if (!modulepath) {
    throw Error('Could not find module '+modulename+' all the way up the file system');
  }
  return modulepath;
}

module.exports = findPathForModuleName;
