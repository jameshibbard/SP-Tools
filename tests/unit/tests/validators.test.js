/* global require, describe, it, beforeEach, pageFactory */

const assert = require('chai').assert;
const { include } = require('../helpers');

include('scripts/wordpress/modules/validators.js');

const fakeDOM = document.createElement('div');
let page;

beforeEach(() => {
  fakeDOM.innerHTML = `
    <textarea id="content"></textarea>
    <textarea id="excerpt"></textarea>
  `;
  page = pageFactory(fakeDOM);
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

  it('should return an error when given a string containing a link with an empty href', () => {
    page.editor.value = 'Blah blah <a href="">yo!</a>';
    const expected = {
      isValid: false,
      message: 'Relative link found: empty href',
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

/* global excerptValidator */
describe('excerptValidator', () => {
  it('should return a success response when given an empty string', () => {
    page.excerpt.value = '';
    const expected = { isValid: true };
    const output = excerptValidator(page);

    assert.equal(JSON.stringify(output), JSON.stringify(expected));
  });

  it('should convert [special] shortcode tags to HTML equivalent', () => {
    page.excerpt.value = '[special]I iz speshul![/special]\n\n<p>Awesome content here</p>';
    const expected = '<p class="wp-special">I iz speshul!</p>\n\n<p>Awesome content here</p>';
    excerptValidator(page);

    assert.equal(page.excerpt.value, expected);
  });

  it('should remove additional <p> tags when converting [special] shortcode tags to HTML equivalent', () => {
    page.excerpt.value = '<p>[special]I iz speshul![/special]</p>\n\n<p>Awesome content here</p>';
    const expected = '<p class="wp-special">I iz speshul!</p>\n\n<p>Awesome content here</p>';
    excerptValidator(page);

    assert.equal(page.excerpt.value, expected);
  });

  it('should remove additional <p> tags including attributes when converting [special] shortcode tags to HTML equivalent', () => {
    page.excerpt.value = '<p class="wp-special">[special]I iz speshul![/special]</p>\n\n<p>Awesome content here</p>';
    const expected = '<p class="wp-special">I iz speshul!</p>\n\n<p>Awesome content here</p>';
    excerptValidator(page);

    assert.equal(page.excerpt.value, expected);
  });

  it('should return an error when given a string containing the [author_more] shortcode', () => {
    page.excerpt.value = '[author_more]';
    const expected = { isValid: false, message: 'Excerpt contains [author_more] shortcode' };
    const output = excerptValidator(page);

    assert.equal(JSON.stringify(output), JSON.stringify(expected));
  });

  it('should return an error when given a string containing a peer review credit', () => {
    page.excerpt.value = 'This article was peer reviewed by God';
    const expected = { isValid: false, message: 'Excerpt contains peer review credit' };
    const output = excerptValidator(page);

    assert.equal(JSON.stringify(output), JSON.stringify(expected));
  });

  it('should return appropriate error when [author_more] and peer review credit are found', () => {
    page.excerpt.value = 'This article was peer reviewed by God [author_more]';
    const expected = { isValid: false, message: 'Excerpt contains [author_more] shortcode, peer review credit' };
    const output = excerptValidator(page);

    assert.equal(JSON.stringify(output), JSON.stringify(expected));
  });
});

/* global slugValidator */
describe('slugValidator', () => {
  it('should return a success response when given an empty string', () => {
    const output = slugValidator(page);
    assert.equal(output.isValid, true);
  });

  it('should return an error when given a string containing an autogenerated URL', () => {
    const span = document.createElement('span');
    span.id = 'editable-post-name-full';
    span.innerHTML = '147107-2';
    fakeDOM.appendChild(span);

    const expected = { isValid: false, message: 'Post URL appears incorrect' };
    const output = slugValidator(page);

    assert.equal(JSON.stringify(output), JSON.stringify(expected));
  });

  it('should return success when given a string containing a valid URL', () => {
    const span = document.createElement('span');
    span.id = 'editable-post-name-full';
    span.innerHTML = '10-reasons-why-js-rocks';
    fakeDOM.appendChild(span);

    const output = slugValidator(page);

    assert.equal(output.isValid, true);
  });
});
