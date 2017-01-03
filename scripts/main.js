/* global chrome, Article, Channel */

'use strict';

// Responds to context menu options
//
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.text) {
    switch (msg.text) {
      case 'getTitle':
        sendResponse($('title').text());
        break;
      case 'getDesc':
        sendResponse($('meta[name="description"]').attr('content'));
        break;
      default:
        sendResponse('');
    }
  }
});

const isArticle = $('meta[property="article:section"]').length;
const isCategory = $('.ChannelBanner').length;

if (isArticle) {
  Article.init();
} else if (isCategory) {
  Channel.init();
}

// Hack to get actual element a user executed the context menu on
// This is currently not available natively: https://bugs.chromium.org/p/chromium/issues/detail?id=39507#c14
// http://stackoverflow.com/questions/7703697/how-to-retrieve-the-element-where-a-contextmenu-has-been-executed
//
let clickedEl;

document.addEventListener('contextmenu', (e) => { clickedEl = e.target; }, true);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request === 'getLinkProperties') {
    if (clickedEl.tagName !== 'A') {
      clickedEl = clickedEl.closest('a');
    }

    sendResponse({
      text: clickedEl.innerHTML.trim(),
      href: clickedEl.href,
      title: clickedEl.title,
    });
  }
});
