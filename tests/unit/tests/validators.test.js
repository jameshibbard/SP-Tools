/* global require, describe, it */

const assert = require('chai').assert;
const include = require('../helpers').include;

include('scripts/wordpress/modules/validators.js');

/* global authorMoreValidator */
describe('authorMore validator', () => {
  it('should return an error when given a string with no [author_more] shortcode', () => {
    const page = {
      editorContents: '',
    };
    const expected = {
      isValid: false,
      message: 'Missing [author_more] shortcode',
    };
    const output = authorMoreValidator(page);

    assert.equal(JSON.stringify(output), JSON.stringify(expected));
  });

  it('should return a success response when given a string containing [author_more]', () => {
    const page = { editorContents: 'Blah blah [author_more] yo!' };
    const expected = { isValid: true };
    const output = authorMoreValidator(page);

    assert.equal(JSON.stringify(output), JSON.stringify(expected));
  });
});

/* global relativeLinkValidator */
describe('relativeLinkValidator', () => {
  it('should return a success response when given a string without relative links', () => {
    const page = { editorContents: 'Blah blah <a href="http://www.sitepoint.com">yo!</a>' };
    const expected = { isValid: true };
    const output = relativeLinkValidator(page);

    assert.equal(JSON.stringify(output), JSON.stringify(expected));
  });

  it('should return an error when given a string containing relative link', () => {
    const page = { editorContents: 'Blah blah <a href="/about-sitepoint">yo!</a>' };
    const expected = {
      isValid: false,
      message: 'Relative link found: /about-sitepoint',
    };
    const output = relativeLinkValidator(page);

    assert.equal(JSON.stringify(output), JSON.stringify(expected));
  });

  it('should mention all relative links in the error message', () => {
    const page = {
      editorContents: 'Blah blah <a href="/about-sitepoint">yo!</a>, and <a href="/jquery-is-awesome">yo!</a>',
    };
    const expected = {
      isValid: false,
      message: 'Relative link found: /about-sitepoint, /jquery-is-awesome',
    };
    const output = relativeLinkValidator(page);

    assert.equal(JSON.stringify(output), JSON.stringify(expected));
  });
});
