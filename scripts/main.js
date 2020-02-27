/* global chrome, MainSite */

'use strict';

// Extension seems to be running on nay site on the internet for Context Menu > Get MD link
// This functionality is broken and should be removed.
if (window.location.origin.indexOf('sitepoint.com') !== -1) MainSite.init();

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
