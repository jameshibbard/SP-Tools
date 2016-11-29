"use strict";

var TagsWidget = (function() {
  var $tagsFrame = $("#tagsdiv-post_tag");
  var $tagsContainer = $tagsFrame.find(".tagchecklist");
  var $tagsButton;

  function copyTags(e){
    e.preventDefault();

    var $tagSpans = $tagsContainer.find("span");
    var tags = $.map($tagSpans, span => span.childNodes[2].nodeValue);

    copyTextToClipboard(tags.join(", "));
  }

  function addCopyTagsButton(){
    $tagsButton = $("<button />", {
      id: "bandaid-copy-tags",
      class: "wp-core-ui button",
      text: "Copy Tags",
      click: copyTags
    });

    $tagsFrame.find(".ajaxtag").append($tagsButton);
  }

  function init(){
    addCopyTagsButton();
  }

  return {
    init: init
  };
})();
