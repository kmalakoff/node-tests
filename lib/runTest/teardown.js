var mock = require('mock-require');

module.exports = function teardown(options, callback) {
  delete global.internalBinding;
  delete global.primordials;
  mock.stopAll();
  callback();
};
