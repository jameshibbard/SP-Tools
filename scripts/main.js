/* global chrome, Article, Channel */

'use strict';

const isArticle = $('meta[property="article:section"]').length;
const isCategory = $('.ChannelBackground').length;

if (isArticle) {
  Article.init();
} else if (isCategory) {
  Channel.init();
}
