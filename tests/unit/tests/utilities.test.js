/* global require, describe, it */

const assert = require('chai').assert;
const include = require('../helpers').include;

include('scripts/utils/utilities.js');

const html = `
  <div>
    <h2 id="firstheading">First heading</h2>
    <p>Some test text in a paragraph</p>
    <h3 id="secondheading">Second heading</h3>
  </div>`;
const headingRegex = /<(h[2-6]).+>(.+)<\/\1>/ig;

/* global getAllMatches */
describe('getAllMatches', () => {
  const paragraph = '<p>Some test text in a paragraph</p>';

  it('should return an empty array if no matches found', () => {
    const result = getAllMatches(headingRegex, paragraph);
    assert.equal(result.length, 0);
  });

  it('should return all matches', () => {
    const result = getAllMatches(headingRegex, html);
    assert.equal(result.length, 2);
  });

  it('should return an array of Paragraph elements', () => {
    const rx = /<p>.*?<\/p>/ig;
    const matches = getAllMatches(rx, html);
    assert.equal(matches.length, 1);
    assert.equal(matches[0][0], paragraph);
  });
});

/* global insertAt */
describe('insertAt', () => {
  const string1 = '<p>Bruno says: </p>';
  const string2 = '<em>PHP sucks</em>';
  const position = 15;

  it('should insert one string into another at the given location', () => {
    const result = insertAt(string1, string2, position);
    assert.equal(result, '<p>Bruno says: <em>PHP sucks</em></p>');
  });

  it('should insert at the beginning if no position supplied', () => {
    const result = insertAt(string1, string2);
    assert.equal(result, '<em>PHP sucks</em><p>Bruno says: </p>');
  });
});

/* global getMatchingElements */
describe('getMatchingElements', () => {
  it('should return an array of Heading elements', () => {
    const elements = getMatchingElements(html, headingRegex);
    assert.equal(elements instanceof Array, true);
    assert.equal(elements[0] instanceof window.HTMLElement, true);
  });

  it('should correctly convert string to DOM elements', () => {
    const elements = getMatchingElements(html, headingRegex);
    assert.equal(elements[0].id, 'firstheading');
    assert.equal(elements[0].innerHTML, 'First heading');
  });

  it('should return an array of Paragraph elements', () => {
    const rx = /<p>.*?<\/p>/ig;
    const elements = getMatchingElements(html, rx);
    assert.equal(elements.length, 1);
    assert.equal(elements[0].innerHTML, 'Some test text in a paragraph');
  });
});

/* global getAllHeadings */
describe('getAllHeadings', () => {
  it('should return an array', () => {
    const headings = getAllHeadings(html);
    assert.equal(headings instanceof Array, true);
  });

  it('should return headings in correct format', () => {
    const headings = getAllHeadings(html);
    const firstHeading = headings[0];
    const desiredResult = { level: 'h2', title: 'First heading', slug: 'firstheading' };
    assert.equal(JSON.stringify(firstHeading), JSON.stringify(desiredResult));
  });

  it('given an empty string, it should return an empty array', () => {
    const headings = getAllHeadings('');
    assert.equal(headings instanceof Array, true);
    assert.equal(headings.length, 0);
  });
});
