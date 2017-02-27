/* exported TagsWidget */
/* global copyTextToClipboard */

'use strict';

const TagsWidget = (function TagsWidget() {
  const $tagsFrame = $('#tagsdiv-post_tag');
  const $tagsContainer = $tagsFrame.find('.tagchecklist');
  let $tagsButton;

  function copyTags(e) {
    e.preventDefault();

    const $tagSpans = $tagsContainer.children('span');
    const tags = $.map($tagSpans, span =>
      $(span)
      .contents()
      .filter((index, node) => node.nodeType === 3)
      .text()
      .trim());

    copyTextToClipboard(tags.join(', '));
  }

  function addCopyTagsButton() {
    $tagsButton = $('<button />', {
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
