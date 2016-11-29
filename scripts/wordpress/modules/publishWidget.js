"use strict";

var PublishWidget = (function() {
  var $publishButton = $("#publish");
  var $saveDraftButton = $("#save-post");
  var $scheduleButtons = $publishButton.add($saveDraftButton);
  var $timeStampDiv = $("#timestampdiv");
  var $datepicker;

  // WP default datetime field IDs
  // mm = month / 01 - 12
  // jj = day
  // aa = year 4 digit
  // hh = hour
  // mn = min
  var $dd = $("#jj");
  var $mm = $("#mm");
  var $yyyy = $("#aa");
  var $hh = $("#hh");
  var $mn = $("#mn");

  function slugIsInvalid(){
    // Field added dynamically, so cannot be cached
    var slugVal = $("#editable-post-name-full").text();

    // Checks:
    // slug value present
    // slug value doesn't consist of just numbers and minuses
    // slug value matches: one or more word characters, a minus,
    // one or more word characters, any number of optional characters
    return typeof slugVal === "undefined" ||
           /^\d*$/.test(slugVal.replace(/-/, '')) ||
           !slugVal.match(/^\w+-\w+.*?$/);
  }

  function addDatePicker(){
    $datepicker = $("<input />", {
      id: "bandaid-datepicker",
      type: "text",
      placeholder: "Date and time"
    });

    $datepicker.datetimepicker();
    $timeStampDiv.prepend($datepicker);
  }

  function attachEventHandlers(){
    $datepicker.on("change", function(){
      // String in format yyyy/mm/dd hh:mm
      var dateString = this.value;

      $yyyy.val(dateString.substr(0, 4));
      $mm.val(dateString.substr(5, 2));
      $dd.val(dateString.substr(8, 2));
      $hh.val(dateString.substr(11, 2));
      $mn.val(dateString.substr(14, 2));
    });

    // Add event listener to 'Save Draft' and 'Publish' buttons
    // to prevent article being saved/scheduled with invalid slug
    $scheduleButtons.on("click", function(){
      if(slugIsInvalid()){
        return window.confirm("URL looks dodgy! Are you sure?");
      }
    });
  }

  function init(){
    addDatePicker();
    attachEventHandlers();
  }

  return {
    init: init
  };
})();
