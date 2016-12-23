/* global require, describe, it, beforeEach */

const assert = require('chai').assert;
const { include, PageMock } = require('../helpers');

include('scripts/wordpress/modules/validators.js');

let page;

beforeEach(() => {
  page = PageMock();
});

/* global authorMoreValidator */
describe('authorMore validator', () => {
  it('should return an error when given a string with no [author_more] shortcode', () => {
    const expected = {
      isValid: false,
      message: 'Missing [author_more] shortcode',
    };
    const output = authorMoreValidator(page);

    assert.equal(JSON.stringify(output), JSON.stringify(expected));
  });

  it('should return a success response when given a string containing [author_more]', () => {
    page.editor.value = 'Blah blah [author_more] yo!';
    const expected = { isValid: true };
    const output = authorMoreValidator(page);

    assert.equal(JSON.stringify(output), JSON.stringify(expected));
  });
});

/* global relativeLinkValidator */
describe('relativeLinkValidator', () => {
  it('should return a success response when given a string without relative links', () => {
    page.editor.value = 'Blah blah <a href="http://www.sitepoint.com">yo!</a>';
    const expected = { isValid: true };
    const output = relativeLinkValidator(page);

    assert.equal(JSON.stringify(output), JSON.stringify(expected));
  });

  it('should return an error when given a string containing relative link', () => {
    page.editor.value = 'Blah blah <a href="/about-sitepoint">yo!</a>';
    const expected = {
      isValid: false,
      message: 'Relative link found: /about-sitepoint',
    };
    const output = relativeLinkValidator(page);

    assert.equal(JSON.stringify(output), JSON.stringify(expected));
  });

  it('should mention all relative links in the error message', () => {
    page.editor.value = 'Blah blah <a href="/about-sitepoint">yo!</a>, and <a href="/jquery-is-awesome">yo!</a>';
    const expected = {
      isValid: false,
      message: 'Relative link found: /about-sitepoint, /jquery-is-awesome',
    };
    const output = relativeLinkValidator(page);

    assert.equal(JSON.stringify(output), JSON.stringify(expected));
  });
});

/* global h1Validator */
describe('h1Validator', () => {
  it('should return a success response when given a string without H1 tags', () => {
    page.editor.value = 'Blah blah <h2>Free Pies!</h2>';
    const expected = { isValid: true };
    const output = h1Validator(page);

    assert.equal(JSON.stringify(output), JSON.stringify(expected));
  });

  it('should return an error when given a string containing an H1 tag', () => {
    page.editor.value = 'Blah blah <h1 id="freepies">Free Pies!</h1>';
    const expected = { isValid: false, message: 'H1 tag found!' };
    const output = h1Validator(page);

    assert.equal(JSON.stringify(output), JSON.stringify(expected));
  });
});
