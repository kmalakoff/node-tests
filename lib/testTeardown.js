var mock = require('mock-require');

module.exports = function teardown() {
  delete global.internalBinding;
  delete global.primordials;
  mock.stopAll();
};
