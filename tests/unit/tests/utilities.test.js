/* global require, describe, it, capitalize */
/* eslint-disable max-len */

const { assert } = require('chai');
const { include } = require('../helpers');

include('scripts/utils/utilities.js');
include('scripts/utils/capitalize.js');

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

/* global getMDLink beforeEach */
describe('getMDLink', () => {
  let linkObj;

  beforeEach(() => {
    linkObj = {
      text: 'SitePoint',
      href: 'https://www.sitepoint.com',
      title: '',
    };
  });

  it('should return a string', () => {
    const MDLink = getMDLink(linkObj);
    assert.equal(typeof MDLink === 'string', true);
  });

  it('should generate a MarkDown link from object', () => {
    const MDLink = getMDLink(linkObj);
    assert.equal(MDLink, '[SitePoint](https://www.sitepoint.com)');
  });

  it('should handle a title attribute', () => {
    linkObj.title = 'Web Learning Resource';
    const MDLink = getMDLink(linkObj);
    assert.equal(MDLink, '[SitePoint](https://www.sitepoint.com "Web Learning Resource")');
  });

  it('should handle a title attribute', () => {
    linkObj.text = '<code>SitePoint</code>';
    const MDLink = getMDLink(linkObj);
    assert.equal(MDLink, '[<code>SitePoint</code>](https://www.sitepoint.com)');
  });

  it('should ignore other attributes', () => {
    linkObj.style = 'color: red;';
    const MDLink = getMDLink(linkObj);
    assert.equal(MDLink, '[SitePoint](https://www.sitepoint.com)');
  });
});

/* global pageFactory */
describe('page object', () => {
  let page;
  let publishBtn;
  const fakeDOM = document.createElement('div');

  beforeEach(() => {
    fakeDOM.innerHTML = `
      <input type="submit" id="publish">
      <input type="checkbox" id="editor-expand-toggle"></input>
      <div id="ed_toolbar"></div>
      <div id="misc-publishing-actions">
        <div id="mollyguard"><a href="#"></a></div>
      </div>
      <table class="post-info-table"></table>
      <textarea id="content">JavaScript FTW!</textarea>
      <textarea id="excerpt"></textarea>
      <table class="post-info-table"></table>
      <table id="post-status-info"></table>
    `;
    page = pageFactory(fakeDOM);
    page.mollyGuard = fakeDOM.querySelector('#mollyguard');
    publishBtn = fakeDOM.querySelector('#publish');
  });

  describe('editor property', () => {
    it('should return a DOM element', () => {
      assert.equal(page.editor instanceof window.HTMLElement, true);
    });
  });

  describe('editorToolbar property', () => {
    it('should return a DOM element', () => {
      assert.equal(page.editorToolbar instanceof window.HTMLElement, true);
    });
  });

  describe('fullHeightEditorToggle property', () => {
    it('should return a DOM element', () => {
      assert.equal(page.fullHeightEditorToggle instanceof window.HTMLElement, true);
    });
  });

  describe('postMessageTable property', () => {
    it('should return a NodeList', () => {
      assert.equal(page.postMessageTable instanceof window.NodeList, true);
    });
  });

  describe('postStatusTable property', () => {
    it('should return a DOM element', () => {
      assert.equal(page.postStatusTable instanceof window.HTMLElement, true);
    });
  });

  describe('publishingActions property', () => {
    it('should return a DOM element', () => {
      assert.equal(page.publishingActions instanceof window.HTMLElement, true);
    });
  });

  describe('excerpt property', () => {
    it('should return a DOM element', () => {
      assert.equal(page.excerpt instanceof window.HTMLElement, true);
    });
  });

  describe('disablePublishBtn function', () => {
    it('should disable the publish button', () => {
      publishBtn.disabled = false;
      page.disablePublishBtn();
      assert.equal(publishBtn.disabled, true);
    });

    it('should show the mollyguard controls', () => {
      page.mollyGuard.style.visibility = 'hidden';
      page.disablePublishBtn();
      assert.equal(page.mollyGuard.style.visibility, 'visible');
    });
  });

  describe('enablePublishBtn function', () => {
    it('should enable the publish button', () => {
      publishBtn.disabled = true;
      page.enablePublishBtn();
      assert.equal(publishBtn.disabled, false);
    });

    it('should hide the mollyguard controls', () => {
      page.mollyGuard.style.visibility = 'visible';
      page.enablePublishBtn();
      assert.equal(page.mollyGuard.style.visibility, 'hidden');
    });

    it('should override the mollyguard when passed true', () => {
      publishBtn.disabled = true;
      page.enablePublishBtn(true);
      page.disablePublishBtn();
      assert.equal(publishBtn.disabled, false);
    });

    it('should change the mollyguard text when passed true', () => {
      page.enablePublishBtn(true);
      const strongEl = page.mollyGuard.querySelector('strong');
      assert.equal(strongEl.textContent, 'Mollyguard overridden');
    });
  });

  describe('getSlug function', () => {
    it('should return an empty string when the element is not present', () => {
      assert.equal(page.getSlug(), '');
    });

    it('should return the current page slug', () => {
      const span = document.createElement('span');
      span.id = 'editable-post-name-full';
      span.innerHTML = '10-reasons-why-js-rocks';
      fakeDOM.appendChild(span);

      assert.equal(page.getSlug(), '10-reasons-why-js-rocks');
    });
  });

  // The capitalize function is a reasonable way to catch obvious errors, but there are a couple of cases it can't handle
  describe('capitalize function', () => {
    it('should return a string in title case', () => {
      // Desired
      assert.equal(capitalize('this is a heading'), 'This Is a Heading');
      assert.equal(capitalize('Step 1: Set Up Test Server'), 'Step 1: Set up Test Server');
      assert.equal(capitalize('Wrapping Up'), 'Wrapping Up');
      assert.equal(capitalize('15 things zsh can do out of the box'), '15 Things Zsh Can Do out of the Box');
      assert.equal(capitalize('15 custom aliases to boost your productivity'), '15 Custom Aliases to Boost Your Productivity');
      assert.equal(capitalize('15 Cool Things You Can Do with (Oh My) ZSH'), '15 Cool Things You Can Do with (Oh My) ZSH');
      assert.equal(capitalize('Using JavaScript Plugins for Fun And Profit'), 'Using JavaScript Plugins for Fun and Profit');
      assert.equal(capitalize('10 Time-saving Rails/Rake Aliases'), '10 Time-Saving Rails/Rake Aliases');
      assert.equal(capitalize('conclusion'), 'Conclusion');
      assert.equal(capitalize('A Basic HTML5 Template For Any Project'), 'A Basic HTML5 Template for Any Project');
      assert.equal(capitalize('What is HTML5?'), 'What Is HTML5?');
      assert.equal(capitalize('The Rest is History'), 'The Rest Is History');

      // Undesired
      assert.equal(capitalize('Listen for “message” Event'), 'Listen For "Message" Event');
      assert.equal(capitalize('Step 6: The Problem with the else … if Chain'), 'Step 6: The Problem with the Else … If Chain');
      assert.equal(capitalize('Step 6: The Problem with the <code>else … if</code> Chain'), 'Step 6: The Problem with the <Code>Else … If</Code> Chain');
      assert.equal(capitalize('10 Handy npm Aliases'), '10 Handy Npm Aliases');
      assert.equal(capitalize('The <code>html</code> Element'), 'The <Code>Html</Code> Element');
    });
  });
});
