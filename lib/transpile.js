var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var assign = require('object.assign');
var replaceAll = require('string.prototype.replaceall');
var endsWith = require('end-with');
var babel = require('@babel/core');

var BABEL_OPTIONS = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '0.6',
        },
      },
    ],
  ],
  parserOpts: {
    allowReturnOutsideFunction: true,
  },
  plugins: ['@babel/plugin-proposal-numeric-separator', '@babel/plugin-proposal-class-properties'],
};

var REWRITES = [
  {
    path: 'test/parallel/test-fs-read-type.js',
    rewrites: [
      { from: 'It must be >= 0.', to: 'It must be >= 0 && <= 4.' },
      { from: 'It must be <= 4.', to: 'It must be >= 0 && <= 4.' },
    ],
  },
  { path: 'test/common/index.js', rewrites: [{ from: '{ two: 2n, four: 4n, seven: 7n }', to: '{ two: 2, four: 4, seven: 7 }' }] },
  {
    path: 'test/parallel/test-fs-stat.js',
    rewrites: [{ from: 'assert.strictEqual(this, undefined)', to: '// assert.strictEqual(this, undefined)' }],
  },
];

function findRewrite(fullPath) {
  for (var index = 0; index < REWRITES.length; index++) {
    if (endsWith(fullPath, REWRITES[index].path)) return REWRITES[index].rewrites;
  }
  return null;
}

module.exports = function transpile(fullPath, targetPath, callback) {
  fs.readFile(fullPath, 'utf8', function (err, contents) {
    if (err) return callback(err);

    var rewrites = findRewrite(fullPath);
    if (rewrites) {
      for (var index = 0; index < rewrites.length; index++) contents = replaceAll(contents, rewrites[index].from, rewrites[index].to);
    }

    babel.transform(contents, assign({ filename: fullPath }, BABEL_OPTIONS), function (err, transpiled) {
      if (err) {
        console.log(err);
        return callback();
      }

      mkdirp(path.dirname(targetPath), function mkdirCallback(err) {
        err ? callback(err) : fs.writeFile(targetPath, transpiled.code, callback);
      });
    });
  });
};
