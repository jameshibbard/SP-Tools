"use strict";

var EditorPane = (function() {

  var $editorToolbar = $("#ed_toolbar");
  var $editorField = $("#content");
  var $postStatusInfoBar = $("#post-status-info tbody");
  var $fullHeightEditorToggle = $('#editor-expand-toggle');
  var $messageContainer; // $(".proofreader-main-row")
  var $messageArea; // $(".proofreader-main-row td")
  var $messageAreaTop; // $(".post-info-table")

  function updateMessages(messages){
    if (messages.length){
      $editorField.addClass('error');
      $messageContainer.addClass("error");
      $messageArea.html(messages.join("<br>"));
    } else {
      $editorField.removeClass('error');
      $messageContainer.removeClass("error");
      $messageArea.text("All good");
    }
  }

  function startChecker(){
    setInterval(function(){
      var errorMessages = [];
      var content = $editorField.val();

      if (content !== "" &&
          content.indexOf("[author_more]") === -1) {
        errorMessages.push("Missing [author_more]!");
      }

      var rx = /<a\s+(?:[^>]*?\s+)?href=(['"])([^"]*)\1/ig;
      var matches = getAllMatches(rx, content);
      $.each(matches, function (i, el) {
        if (!linkOk(el[2])) {
          errorMessages.push("Relative link found: " + el[2]);
        }
      });

      updateMessages(errorMessages);

      // Stop dynamically generated messages overlapping editor field
      if ($messageAreaTop.is(":visible")){
        $editorField.css(
          "margin-top", $editorToolbar.outerHeight(true)
        );
      }
    }, 2000);
  }

  function addEventHandlers(){
    // If the "Enable full-height editor and distraction-free functionality"
    // option is selected in the Screen Options menu (top right hand corner)
    // then the status bar should be shown above and below the editor area.
    // If it is deselected, then it should only be shown below it.
    // Screen Options preferences are saved locally in a cookie
    $fullHeightEditorToggle.on("change", function(){
      if ($(this).is(":checked")) {
        $messageAreaTop.show();
      } else {
        $messageAreaTop.hide();
      }
    });

    $fullHeightEditorToggle.change();
  }

  function init(){
    getTemplate("info-row.html")
    .then(function(html){
      $editorToolbar.append(html);
      $postStatusInfoBar.prepend($(".proofreader-main-row").clone());
      $messageContainer = $(".proofreader-main-row");
      $messageAreaTop = $(".post-info-table");
      $messageArea = $(".bandaid-message");

      addEventHandlers();
      startChecker();
    });
  }

  return {
    init: init
  };
})();
