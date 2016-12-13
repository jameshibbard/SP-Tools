/* exported EditorPane */
/* global getTemplate, pageFactory, authorMoreValidator, relativeLinkValidator */

'use strict';

const EditorPane = (function EditorPane() {
  const page = pageFactory(document);
  const $editorToolbar = $('#ed_toolbar');
  const $editorField = $('#content');
  const $postStatusInfoBar = $('#post-status-info tbody');
  const $fullHeightEditorToggle = $('#editor-expand-toggle');
  let $messageContainer; // $(".proofreader-main-row")
  let $messageArea; // $(".proofreader-main-row td")
  let $messageAreaTop; // $(".post-info-table")

  function updateMessages(messages = []) {
    if (messages.length) {
      $editorField.addClass('error');
      $messageContainer.addClass('error');
      $messageArea.html(messages.join('<br>'));
    } else {
      $editorField.removeClass('error');
      $messageContainer.removeClass('error');
      $messageArea.text('All good');
    }

    // Stop dynamically generated messages overlapping editor field
    if ($messageAreaTop.is(':visible')) {
      $editorField.css('margin-top', $editorToolbar.outerHeight(true));
    }
  }

  function runChecks(validators) {
    if (page.editorContents === '') return updateMessages();

    const errorMessages = [];

    validators.forEach((v) => {
      const result = v(page);
      if (result.isValid === false) {
        errorMessages.push(result.message);
      }
    });

    return updateMessages(errorMessages);
  }

  function startChecker() {
    const validators = [
      authorMoreValidator,
      relativeLinkValidator,
    ];

    runChecks(validators);
    setInterval(() => runChecks(validators), 2000);
  }

  function addEventHandlers() {
    // If the "Enable full-height editor and distraction-free functionality"
    // option is selected in the Screen Options menu (top right hand corner)
    // then the status bar should be shown above and below the editor area.
    // If it is deselected, then it should only be shown below it.
    // Screen Options preferences are saved locally in a cookie
    $fullHeightEditorToggle.on('change', function toggleEditorHeight() {
      if ($(this).is(':checked')) {
        $messageAreaTop.show();
      } else {
        $messageAreaTop.hide();
      }
    });

    $fullHeightEditorToggle.change();
  }

  function createStatusAreas() {
    return getTemplate('info-row.html')
      .then((html) => {
        $editorToolbar.append(html);
        $postStatusInfoBar.prepend($('.proofreader-main-row').clone());
        $messageContainer = $('.proofreader-main-row');
        $messageAreaTop = $('.post-info-table');
        $messageArea = $('.bandaid-message');
      });
  }

  return {
    init() {
      createStatusAreas()
        .then(() => {
          addEventHandlers();
          startChecker();
        });
    },
  };
}());
