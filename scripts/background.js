/* global chrome, copyTextToClipboard,getMDLink */

'use strict';

// var settings = new Store("settings", {
//   "sample_setting": "This is how you use Store.js to remember values"
// });

// Use runtime.onMessage instead of extension.onMessage
// https://developer.chrome.com/extensions/runtime#event-onMessage
//
// chrome.extension.onMessage.addListener(
//   function (request, sender, sendResponse) {
//     chrome.pageAction.show(sender.tab.id);
//     sendResponse(settings.toObject());
//   }
// );

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
      copyTextToClipboard(title);
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
      copyTextToClipboard(title);
    });
  },
  documentUrlPatterns: ['*://*.sitepoint.com/*'],
});

chrome.contextMenus.create({
  title: 'Get newsletter link',
  contexts: ['link'],
  onclick: (info) => {
    $.get(info.linkUrl, (data) => {
      const title = $(data).filter('title').text();
      const desc = $(data).filter("meta[name='description']").attr('content');

      const newsletterLink = (`<p>
          <a href="${info.linkUrl}">${title}</a><br />
          ${desc}
        </p>
      `).replace(/^ {6,8}/gm, '');

      copyTextToClipboard(newsletterLink);
    });
  },
  documentUrlPatterns: ['*://*.sitepoint.com/*'],
});

chrome.contextMenus.create({
  title: 'Get MD link',
  contexts: ['link'],
  onclick: (info, tab) => {
    chrome.tabs.sendMessage(tab.id, 'getLinkProperties', (props) => {
      const MDLink = getMDLink(props);
      copyTextToClipboard(MDLink);
    });
  },
});
