var fs = require('fs');
var babel = require('@babel/core');
var assign = require('object.assign');

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

module.exports = function transpile(entry, targetPath, callback) {
  fs.readFile(entry.fullPath, 'utf8', function (err, contents) {
    if (err) return callback(err);

    babel.transform(contents, assign({ filename: entry.fullPath }, BABEL_OPTIONS), function (err, transpiled) {
      if (err) {
        console.log(err);
        return callback();
      }
      fs.writeFile(targetPath, transpiled.code, callback);
    });
  });
};
