/* global require, global, module */

const fs = require('fs');
const vm = require('vm');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

// Create document and window objects for use in Mocha tests
// https://github.com/jquense/teaspoon/issues/12
global.dom = new JSDOM('<!doctype html><html><body></body></html>');
global.window = global.dom.window;
global.document = global.dom.window.document;
global.navigator = global.window.navigator;

// load JS script into global scope
function include(path) {
  const code = fs.readFileSync(path, 'utf-8');
  vm.runInThisContext(code, path);
}

module.exports = { include };
