var mochalib = require('../src/mocha');

function main (execlib) {
  mochalib.initWithExecLib(execlib);
  var mocha = new (mochalib.getMocha())({
  });
  mocha.addFile(process.argv[3]);
  mocha.run();
}

module.exports = main;
