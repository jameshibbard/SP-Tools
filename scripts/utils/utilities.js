/* exported getAllMatches linkOk copyTextToClipboard getTemplate pageFactory */
/* global chrome */

// Miscellaneous functions without a specific context

/**
 * Returns an array of all matches in a regex global search
 *
 * @param myRe RegExp
 * @param str String to search
 * @returns {Array}
 */
function getAllMatches(myRe, str) {
  const returnData = [];
  let myArray;
  /* eslint-disable-next-line no-cond-assign */
  while ((myArray = myRe.exec(str)) !== null) {
    returnData.push(myArray);
  }
  return returnData;
}

/**
 * Checks if the URL starts with a protocol, i.e. if it's absolute
 *
 * @param url
 * @returns {boolean}
 */
function linkOk(url) {
  const r = new RegExp('^(?:[a-z]+:)?//', 'i');
  return (r.test(url) || url.startsWith('mailto:') || url.startsWith('#'));
}

/**
 * Copies passed in text to clipboard
 *
 * @param text
 */
function copyTextToClipboard(text) {
  const copyFrom = document.createElement('textarea');
  copyFrom.textContent = text;
  const body = document.getElementsByTagName('body')[0];
  body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  body.removeChild(copyFrom);
}

/**
 * Fetches template contents
 * @param fileName
 * @returns {Promise<string>}
 * http://stackoverflow.com/a/14220323
 */
function getTemplate(fileName) {
  const templateURL = chrome.runtime.getURL(`/fragments/${fileName}`);
  return fetch(templateURL).then((response) => response.text());
}

function pageFactory(dom = document) {
  // Set up cached elements
  const editor = dom.querySelector('#content');
  const editorToolbar = dom.querySelector('#ed_toolbar');
  const fullHeightEditorToggle = dom.querySelector('#editor-expand-toggle');
  const postMessageTable = dom.querySelectorAll('.post-info-table');
  const postStatusTable = dom.querySelector('#post-status-info');
  const publishingActions = dom.querySelector('#misc-publishing-actions');
  const excerpt = dom.querySelector('#excerpt');

  // Private
  const publishBtn = dom.querySelector('#publish');
  let isMollyguardEnabled = true;

  function disablePublishBtn() {
    this.mollyGuard.style.visibility = 'visible';
    if (isMollyguardEnabled) publishBtn.disabled = true;
  }

  function enablePublishBtn(overrideChecks = false) {
    if (overrideChecks) {
      isMollyguardEnabled = false;
      this.mollyGuard.querySelector('a').outerHTML = '<strong>Mollyguard overridden</strong>';
    } else {
      this.mollyGuard.style.visibility = 'hidden';
    }
    publishBtn.disabled = false;
  }

  function getSlug() {
    const el = dom.querySelector('#editable-post-name-full');
    return el ? el.textContent : '';
  }

  return {
    editor,
    editorToolbar,
    fullHeightEditorToggle,
    postMessageTable,
    postStatusTable,
    publishingActions,
    excerpt,
    mollyGuard: null, // <div> element inserted dynamically in editorPane.js
    disablePublishBtn,
    enablePublishBtn,
    getSlug,
  };
}
