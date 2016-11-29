"use strict";

var SeriesWidget = (function(){
  var $seriesInput = $("#newseries");
  var $seriesChecklist = $("#serieschecklist li");

  function addInstaFilter(){
    $seriesInput.on("keyup", function(){
      var text = $seriesInput.val().toLowerCase();

      if (text === "") {
        $seriesChecklist.removeClass("hidden");
        return;
      }

      $.each($seriesChecklist, function(index, listItem){
        var seriesName = $(listItem).text().toLowerCase();

        if (seriesName.indexOf(text) > -1) {
          $(listItem).removeClass("hidden");
        } else {
          $(listItem).addClass("hidden");
        }
      });
    });
  }

  function init(){
    addInstaFilter();
  }

  return {
    init: init
  };
})();
