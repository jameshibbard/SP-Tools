"use strict";

// Responds to context menu options
//
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.text) {
    switch (msg.text) {
      case "getTitle":
        sendResponse($('title').text());
        break;
      case "getDesc":
        sendResponse($('meta[name="description"]').attr("content"));
        break;
      default:
        sendResponse("");
    }
  }
});

const isArticle = $("meta[property='article:section']").length;
const isCategory = $(".ChannelBanner").length;

if(isArticle){
  Article.init();
} else if(isCategory){
  Channel.init();
}
