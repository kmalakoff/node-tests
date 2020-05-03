var path = require('path');
var fs = require('fs');
var assign = require('object.assign');
var mock = require('mock-require');
var Queue = require('queue-cb');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var uuid = require('uuid');

var download = require('./lib/download');
var moveExtracted = require('./lib/moveExtracted');
var buildFolder = require('./lib/buildFolder');
var runTestFolder = require('./lib/runTestFolder');
var testSetup = require('./lib/testSetup');
var testTeardown = require('./lib/testTeardown');

var DEFAULT_OPTIONS = {
  cacheDirectory: path.join(__dirname, '.cache'),
  buildDirectory: path.join(__dirname, '.build'),
  downloadURL: function downloadURL(version) {
    return 'https://codeload.github.com/nodejs/node/zip/' + version;
  },
};
var BUILD_FOLDERS = [path.join('lib', 'internal'), 'test'];
var TEST_FOLDERS = ['parallel'];

function NodeTests(options) {
  options = options || {};
  this.options = assign({}, DEFAULT_OPTIONS, options);
}

NodeTests.prototype.clean = function clean(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = assign({}, options || {}, this.options);
  var cacheTarget = options.version ? path.join(options.cacheDirectory, options.version) : options.cacheDirectory;
  var buildTarget = options.version ? path.join(options.buildDirectory, options.version) : options.buildDirectory;

  var queue = new Queue(1);
  queue.defer(rimraf.bind(null, cacheTarget, {}));
  queue.defer(rimraf.bind(null, buildTarget, {}));
  queue.await(callback);
};

NodeTests.prototype.install = function install(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = assign({}, options || {}, this.options);
  if (!options.version) return callback(new Error('Options are missing version'));
  var cacheTarget = path.join(options.cacheDirectory, options.version);

  fs.access(cacheTarget, function (missing) {
    if (!missing && !options.force) return callback();

    var tempTarget = path.join(path.dirname(cacheTarget), uuid.v4());
    var queue = new Queue(1);
    missing || queue.defer(rimraf.bind(null, cacheTarget));
    queue.defer(mkdirp.bind(null, cacheTarget));
    queue.defer(download.bind(null, tempTarget, options));
    queue.defer(moveExtracted.bind(null, tempTarget, cacheTarget, options));
    queue.await(function (err) {
      var q2 = new Queue();
      q2.defer(rimraf.bind(null, tempTarget, {}));
      !err || q2.defer(rimraf.bind(null, cacheTarget, {}));
      q2.await(function (err2) {
        callback(err || err2);
      });
    });
  });
};

NodeTests.prototype.build = function build(options, callback) {
  var self = this;
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = assign({}, options || {}, this.options);
  if (!options.version) return callback(new Error('Options are missing version'));
  var buildTarget = path.join(options.buildDirectory, options.version);

  fs.access(buildTarget, function (missing) {
    if (!missing && !options.force) return callback();

    var queue = new Queue(1);
    missing || queue.defer(rimraf.bind(null, buildTarget));
    queue.defer(self.install.bind(this, options));
    for (var index in BUILD_FOLDERS) queue.defer(buildFolder.bind(null, BUILD_FOLDERS[index], options));
    queue.await(callback);
  });
};

NodeTests.prototype.runSuite = function runSuite(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = assign({}, options || {}, this.options);
  if (!options.version) return callback(new Error('Options are missing version'));

  var queue = new Queue(1);
  queue.defer(this.install.bind(this, options));
  queue.defer(this.build.bind(this, options));
  for (var index in TEST_FOLDERS) queue.defer(runTestFolder.bind(null, TEST_FOLDERS[index], options));
  queue.await(callback);
};

NodeTests.prototype.runTest = function runTest(testPath, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  options = assign({}, options || {}, this.options);
  if (!options.version) return callback(new Error('Options are missing version'));

  // replace module under test
  if (options.module) {
    try {
      var parts = options.module.split(',');
      mock(parts[0], require(parts[1]));
    } catch (err) {
      return callback(err);
    }
  }

  var queue = new Queue(1);
  queue.defer(testSetup.bind(null, options));
  queue.defer(function (callback) {
    try {
      require(path.join(options.buildDirectory, options.version, 'test', testPath));
      callback();
    } catch (err) {
      callback(err);
    }
  });
  queue.await(function (err) {
    testTeardown(options);
    callback(err);
  });
};

module.exports = NodeTests;
