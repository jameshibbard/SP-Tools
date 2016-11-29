"use strict";

var PostPage = (function() {
  function hideUnnecessaryElements(){
    // WP own date input
    // Why are we hiding this, not removing it?
    $(".timestamp-wrap").hide();

    // Is this a good headline?
    $(".CosheduleButtonContainer").remove();

    // Publish to Discourse option
    $("input[name='publish_to_discourse']").closest("div").remove();
  }

  function init(){
    hideUnnecessaryElements();
  }

  return {
    init: init
  };
})();
