'use strict';

var common = require('../common');

var assert = require('assert');

var fs = require('fs');

var options = 'test';
var expectedError = {
  code: 'ERR_INVALID_OPT_VALUE_ENCODING',
  name: 'TypeError'
};
assert["throws"](function () {
  fs.readFile('path', options, common.mustNotCall());
}, expectedError);
assert["throws"](function () {
  fs.readFileSync('path', options);
}, expectedError);
assert["throws"](function () {
  fs.readdir('path', options, common.mustNotCall());
}, expectedError);
assert["throws"](function () {
  fs.readdirSync('path', options);
}, expectedError);
assert["throws"](function () {
  fs.readlink('path', options, common.mustNotCall());
}, expectedError);
assert["throws"](function () {
  fs.readlinkSync('path', options);
}, expectedError);
assert["throws"](function () {
  fs.writeFile('path', 'data', options, common.mustNotCall());
}, expectedError);
assert["throws"](function () {
  fs.writeFileSync('path', 'data', options);
}, expectedError);
assert["throws"](function () {
  fs.appendFile('path', 'data', options, common.mustNotCall());
}, expectedError);
assert["throws"](function () {
  fs.appendFileSync('path', 'data', options);
}, expectedError);
assert["throws"](function () {
  fs.watch('path', options, common.mustNotCall());
}, expectedError);
assert["throws"](function () {
  fs.realpath('path', options, common.mustNotCall());
}, expectedError);
assert["throws"](function () {
  fs.realpathSync('path', options);
}, expectedError);
assert["throws"](function () {
  fs.mkdtemp('path', options, common.mustNotCall());
}, expectedError);
assert["throws"](function () {
  fs.mkdtempSync('path', options);
}, expectedError);
assert["throws"](function () {
  fs.ReadStream('path', options);
}, expectedError);
assert["throws"](function () {
  fs.WriteStream('path', options);
}, expectedError);