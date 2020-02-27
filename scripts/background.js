/* global chrome, copyTextToClipboard */

'use strict';

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
    $.get(info.linkUrl, (data) => {
      const desc = $(data).filter("meta[name='description']").attr('content');
      copyTextToClipboard(desc);
    });
  },
  documentUrlPatterns: ['*://*.sitepoint.com/*'],
});

chrome.contextMenus.create({
  title: 'Copy target title',
  contexts: ['link'],
  onclick: (info) => {
    $.get(info.linkUrl, (data) => {
      const title = $(data).filter('title').text();
      copyTextToClipboard(title.replace(' — SitePoint', ''));
    });
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
        { urls: ['<all_urls>'] },
        ['blocking'],
      );
    } else {
      chrome.webRequest.onBeforeRequest.removeListener(
        blockInfiniteScroll,
        { urls: ['<all_urls>'] },
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
