"use strict";

var SyntaxHighlightingWidget = (function(){
  var $primaryCategory = $("#primary_category");
  var $categorychecklist = $("#categorychecklist > li input[type='checkbox']");
  var $mostUsedcheckList = $("#categorychecklist-pop > li input[type='checkbox']");
  var $categoryLists = $categorychecklist.add($mostUsedcheckList);
  var $syntaxSelector = $("select[name='base_syntax']");

  function getText(node){
    return $.trim($(node).text());
  }

  function setDefaultHighlighting(){
    var optionText = getText($primaryCategory.find("option:selected"));

    var syntaxOptionValue = $syntaxSelector.find("option").filter(function(){
      return getText(this).toLowerCase() === optionText.toLowerCase();
    }).val();

    if(syntaxOptionValue){
      $syntaxSelector.val(syntaxOptionValue);
    } else {
      $syntaxSelector.prop("selectedIndex", 0);
    }
  }

  // There is a bug in our custom fields implementation
  // whereby if a category checkbox is unchecked, the corresponding entry
  // is not removed from the Primary Category dropdown.
  //
  function removeDuplicateEntries(checkbox){
    if(!$(checkbox).is(":checked")){
      var category = getText(checkbox.parentNode);

      $primaryCategory.find("option").each(function(){
        if(getText(this) === category){
          $(this).remove();
        }
      });
    }
  }

  function addEventHandlers(){
    $primaryCategory.on("change", setDefaultHighlighting);
    $categoryLists.on("change", function(){
        removeDuplicateEntries(this);
        setDefaultHighlighting();
    });
  }

  function init(){
    addEventHandlers();
  }

  return {
    init: init
  };
})();
