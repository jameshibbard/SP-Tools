/* exported SyntaxHighlightingWidget */

'use strict';

const SyntaxHighlightingWidget = (function SyntaxHighlightingWidget() {
  const $primaryCategory = $('#primary_category');
  const $categorychecklist = $("#categorychecklist > li input[type='checkbox']");
  const $mostUsedcheckList = $("#categorychecklist-pop > li input[type='checkbox']");
  const $categoryLists = $categorychecklist.add($mostUsedcheckList);
  const $syntaxSelector = $("select[name='base_syntax']");

  function getText(node) {
    return $.trim($(node).text());
  }

  function setDefaultHighlighting() {
    const optionText = getText($primaryCategory.find('option:selected'));

    const syntaxOptionValue = $syntaxSelector.find('option').filter(function handleFilter() {
      return getText(this).toLowerCase() === optionText.toLowerCase();
    }).val();

    if (syntaxOptionValue) {
      $syntaxSelector.val(syntaxOptionValue);
    } else {
      $syntaxSelector.prop('selectedIndex', 0);
    }
  }

  // There is a bug in our custom fields implementation
  // whereby if a category checkbox is unchecked, the corresponding entry
  // is not removed from the Primary Category dropdown.
  //
  function removeDuplicateEntries(checkbox) {
    if (!$(checkbox).is(':checked')) {
      const category = getText(checkbox.parentNode);

      $primaryCategory.find('option').each(function handleRemoveDuplicate() {
        if (getText(this) === category) {
          $(this).remove();
        }
      });
    }
  }

  function addEventHandlers() {
    $primaryCategory.on('change', setDefaultHighlighting);
    $categoryLists.on('change', function handleChange() {
      removeDuplicateEntries(this);
      setDefaultHighlighting();
    });
  }

  function init() {
    addEventHandlers();
  }

  return {
    init,
  };
}());
