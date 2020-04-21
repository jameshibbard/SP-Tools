/* global chrome */

'use strict';

// Utility function
function copyTextToClipboard(text) {
  const copyFrom = document.createElement('textarea');
  copyFrom.textContent = text;
  const body = document.getElementsByTagName('body')[0];
  body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  body.removeChild(copyFrom);
}

function handleFetchError(err) {
  console.warn('Something went wrong.', err);
}

// Context menu entries
chrome.contextMenus.create({
  title: 'Copy description',
  contexts: ['page'],
  onclick: (info, tab) => {
    chrome.tabs.sendMessage(tab.id, { text: 'getDesc' }, (desc) => {
      copyTextToClipboard(desc);
    });
  },
  documentUrlPatterns: ['*://*.sitepoint.com/*'],
});

chrome.contextMenus.create({
  title: 'Copy title',
  contexts: ['page'],
  onclick: (info, tab) => {
    chrome.tabs.sendMessage(tab.id, { text: 'getTitle' }, (title) => {
      copyTextToClipboard(title.replace(' — SitePoint', ''));
    });
  },
  documentUrlPatterns: ['*://*.sitepoint.com/*'],
});

chrome.contextMenus.create({
  title: 'Copy target description',
  contexts: ['link'],
  onclick: (info) => {
    fetch(info.linkUrl)
      .then((res) => res.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const desc = doc.querySelector("meta[name='description']").getAttribute('content');
        copyTextToClipboard(desc);
      })
      .catch(handleFetchError);
  },
  documentUrlPatterns: ['*://*.sitepoint.com/*'],
});

chrome.contextMenus.create({
  title: 'Copy target title',
  contexts: ['link'],
  onclick: (info) => {
    fetch(info.linkUrl)
      .then((res) => res.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const title = doc.querySelector('title').textContent;
        copyTextToClipboard(title.replace(' — SitePoint', ''));
      })
      .catch(handleFetchError);
  },
  documentUrlPatterns: ['*://*.sitepoint.com/*'],
});

chrome.contextMenus.create({
  title: 'Get MD link',
  contexts: ['link'],
  onclick: (info) => {
    const selectedTextPresent = Object.prototype.hasOwnProperty.call(info, 'selectionText');
    const text = selectedTextPresent ? info.selectionText : 'xxx';
    copyTextToClipboard(`[${text}](${info.linkUrl})`);
  },
});
