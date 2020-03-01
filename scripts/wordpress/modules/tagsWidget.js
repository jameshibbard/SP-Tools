/* exported TagsWidget */
/* global copyTextToClipboard */

'use strict';

const TagsWidget = (function TagsWidget() {
  const $tagsFrame = $('#tagsdiv-post_tag');

  function copyTags(e) {
    e.preventDefault();

    const $tagList = $('.tagchecklist > li');
    const tags = $.map($tagList, (span) => $(span)
      .contents()
      .filter((index, node) => node.nodeType === 3)
      .text()
      .trim());

    copyTextToClipboard(tags.join(', '));
  }

  function addCopyTagsButton() {
    const $tagsButton = $('<button />', {
      id: 'bandaid-copy-tags',
      class: 'wp-core-ui button',
      text: 'Copy Tags',
      click: copyTags,
    });

    $tagsFrame.find('.ajaxtag').append($tagsButton);
  }

  return {
    init() {
      addCopyTagsButton();
    },
  };
}());
