"use strict";

var PostPage = (function() {
  function hideUnnecessaryElements(){
    // WP own date input
    // Why are we hiding this, not removing it?
    $(".timestamp-wrap").hide();

    // Is this a good headline?
    $(".CosheduleButtonContainer").remove();
  }

  function init(){
    hideUnnecessaryElements();
  }

  return {
    init: init
  };
})();
