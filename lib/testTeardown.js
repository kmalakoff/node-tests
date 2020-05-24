var mock = require('mock-require-lazy');

module.exports = function teardown() {
  delete global.internalBinding;
  delete global.primordials;
  mock.stopAll();
};
