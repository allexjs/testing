var mochalib = {};

(function() {
  'use strict';
  require('./globals')(mochalib);
  require('./findSink')(mochalib);
  require('./tryModuleName')(mochalib);
  require('./startService')(mochalib);
})()

module.exports = mochalib;
