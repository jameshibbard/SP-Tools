// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

// Use runtime.onMessage instead of extension.onMessage
// https://developer.chrome.com/extensions/runtime#event-onMessage
//
// chrome.extension.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         chrome.pageAction.show(sender.tab.id);
//         sendResponse(settings.toObject());
//     }
// );

chrome.contextMenus.create({
  'title': "Copy description",
  'contexts': ['page'],
  'onclick': function (info, tab) {
    chrome.tabs.sendMessage(tab.id, {text: "getDesc"}, function (desc) {
      copyTextToClipboard(desc);
    });
  },
  'documentUrlPatterns': ["*://*.sitepoint.com/*"]
});

chrome.contextMenus.create({
  'title': "Copy title",
  'contexts': ['page'],
  'onclick': function (info, tab) {
    chrome.tabs.sendMessage(tab.id, {text: "getTitle"}, function (title) {
      copyTextToClipboard(title);
    });
  },
  'documentUrlPatterns': ["*://*.sitepoint.com/*"]
});

chrome.contextMenus.create({
  'title': "Copy target description",
  'contexts': ['link'],
  'onclick': function (info, tab) {
    $.get(info.linkUrl, function(data){
      var desc = $(data).filter("meta[name='description']").attr('content');
      copyTextToClipboard(desc);
    });
  },
  'documentUrlPatterns': ["*://*.sitepoint.com/*"]
});

chrome.contextMenus.create({
  'title': "Copy target title",
  'contexts': ['link'],
  'onclick': function (info, tab) {
    $.get(info.linkUrl, function(data){
      var title = $(data).filter("title").text();
      copyTextToClipboard(title);
    });
  },
  'documentUrlPatterns': ["*://*.sitepoint.com/*"]
});

chrome.contextMenus.create({
  'title': "Get newsletter link",
  'contexts': ['link'],
  'onclick': function (info, tab) {
    $.get(info.linkUrl, function(data){
      var title = $(data).filter("title").text();
      var desc = $(data).filter("meta[name='description']").attr('content');

      var newsletterLink = (`<p>
          <a href="${info.linkUrl}">${title}</a><br />
          ${desc}
        </p>
      `).replace(/^        /gm, '');

      copyTextToClipboard(newsletterLink);
    });
  },
  'documentUrlPatterns': ["*://*.sitepoint.com/*"]
});
