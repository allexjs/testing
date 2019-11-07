var mochalib = require('../src/mocha');

function main (execlib) {
  try {
    mochalib.initWithExecLib(execlib);
    var mocha = new (mochalib.getMocha())({
    });
    mocha.addFile(process.argv[3]);
    mocha.run();
  } catch (e) {
    console.error('Mocha error:', e);
  }
}

module.exports = main;
