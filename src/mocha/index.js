var mochalib = {};

(function() {
  'use strict';
  require('./globals')(mochalib);
  require('./findSink')(mochalib);
})()

module.exports = mochalib;
