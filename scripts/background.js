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

// Enable UI clean up and disable infinite scroll by default
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(
    {
      'clean-up-ui': true,
      'infinite-scroll': true,
    },
  );
});

// The first time sendMessage fires, the content script is not available.
// So we need to handle errors before retrying
// https://stackoverflow.com/a/56787332
function ping(tabId) {
  chrome.tabs.sendMessage(tabId, { text: 'urlChanged' }, (res) => {
    if (chrome.runtime.lastError) {
      setTimeout(() => { ping(tabId); }, 500);
    }
  });
}

// As SitePoint has started using Ajax to update pages dynamically, we need to
// detect URL changes and reat to those, otherwise the extension will not work as you nagigate around the site.
// https://stackoverflow.com/a/51025612
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.url.match('sitepoint.com')) ping(details.tabId);
});
