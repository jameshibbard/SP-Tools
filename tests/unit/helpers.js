// utilities.test.js
const fs = require('fs');
const vm = require('vm');
const jsdom = require('jsdom').jsdom;

// Create document and window objects for use in Mocha tests
// https://github.com/jquense/teaspoon/issues/12
global.document = jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;

// load JS script into global scope
function include(path) {
  const code = fs.readFileSync(path, 'utf-8');
  vm.runInThisContext(code, path);
}

module.exports = { include };
