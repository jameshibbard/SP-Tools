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

// Turn off infinite scroll functionality. This comes from a WordPress plugin at:
// https://www.sitepoint.com/wp-content/plugins/ajax-load-more/core/dist/js/ajax-load-more.min.js?ver=5.1.2
// As it is attached to various event handlers (e.g. scroll, load), it is easier to block, than to overwrite.
// See: https://developer.chrome.com/extensions/webRequest#examples
function blockInfiniteScroll(details) {
  const cancelable = details.url.indexOf('ajax-load-more') !== -1;
  return { cancel: cancelable };
}

function toggleInfiniteScroll() {
  chrome.storage.sync.get(['infinite-scroll'], (res) => {
    if (res['infinite-scroll']) {
      chrome.webRequest.onBeforeRequest.addListener(
        blockInfiniteScroll,
        { urls: ['https://www.sitepoint.com/wp-content/plugins/ajax-load-more/*'] },
        ['blocking'],
      );
    } else {
      chrome.webRequest.onBeforeRequest.removeListener(
        blockInfiniteScroll,
        { urls: ['https://www.sitepoint.com/wp-content/plugins/ajax-load-more/*'] },
        ['blocking'],
      );
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'TOGGLE-INFINITE-SCROLL') {
    toggleInfiniteScroll();
    sendResponse({ message: 'Infinite scroll toggled in background.js' });
  }
});

// Enable UI clean up and disable infinite scroll by default
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set(
    {
      'clean-up-ui': true,
      'infinite-scroll': true,
    }, () => {
      toggleInfiniteScroll();
    },
  );
});

toggleInfiniteScroll();
