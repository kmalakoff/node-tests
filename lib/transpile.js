var fs = require('fs');
var babel = require('@babel/core');
var assign = require('object.assign');
var replaceAll = require('string.prototype.replaceall');

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
  plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-numeric-separator', '@babel/plugin-proposal-class-properties'],
};

var REWRITES = {
  'test-fs-read-type.js': [
    { from: 'It must be >= 0.', to: 'It must be >= 0 && <= 4.' },
    { from: 'It must be <= 4.', to: 'It must be >= 0 && <= 4.' },
  ],
};

module.exports = function transpile(entry, targetPath, callback) {
  fs.readFile(entry.fullPath, 'utf8', function (err, contents) {
    if (err) return callback(err);

    babel.transform(contents, assign({ filename: entry.fullPath }, BABEL_OPTIONS), function (err, transpiled) {
      if (err) {
        console.log(err);
        return callback();
      }
      var rewrites = REWRITES[entry.basename];
      if (rewrites) {
        for (var index in rewrites) {
          transpiled.code = replaceAll(transpiled.code, rewrites[index].from, rewrites[index].to);
        }
      }
      fs.writeFile(targetPath, transpiled.code, callback);
    });
  });
};
