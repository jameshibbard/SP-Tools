/* global chrome, copyTextToClipboard,getMDLink */

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
  onclick: (info, tab) => {
    chrome.tabs.sendMessage(tab.id, 'getLinkProperties', (props) => {
      const MDLink = getMDLink(props);
      copyTextToClipboard(MDLink);
    });
  },
});
