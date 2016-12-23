/* exported EditorPane */
/* global getTemplate, pageFactory, authorMoreValidator, relativeLinkValidator, h1Validator */

'use strict';

const EditorPane = (function EditorPane() {
  const page = pageFactory();

  /* eslint no-param-reassign: ["error", { "props": false }] */
  function updateMessages(messages = []) {
    if (messages.length) {
      page.editor.classList.add('error');
      page.postMessageTable.forEach((el) => {
        el.querySelector('td').classList.add('error');
        el.querySelector('td').innerHTML = messages.join('<br>');
      });
    } else {
      page.editor.classList.remove('error');
      page.postMessageTable.forEach((el) => {
        el.querySelector('td').classList.remove('error');
        el.querySelector('td').innerHTML = 'All good';
      });
    }

    Object.assign(document.querySelector('.post-info-table').style, {
      position: 'relative',
      top: `${page.editorToolbar.offsetHeight}px`,
    });
  }

  function runChecks(validators) {
    if (page.editor.value === '') return updateMessages();

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
      h1Validator,
    ];

    runChecks(validators);
    setInterval(() => runChecks(validators), 1000);
  }

  function addEventHandlers() {
    // If the "Enable full-height editor and distraction-free functionality"
    // option is selected in the Screen Options menu (top right hand corner)
    // then the status bar should be shown above and below the editor area.
    // If it is deselected, then it should only be shown below it.
    // Screen Options preferences are saved locally in a cookie
    page.fullHeightEditorToggle.addEventListener('change', function toggleEditorHeight() {
      page.postMessageTable[0].style.display = (this.checked) ? '' : 'none';
    });

    const event = document.createEvent('HTMLEvents');
    event.initEvent('change', true, false);
    page.fullHeightEditorToggle.dispatchEvent(event);
  }

  function createStatusAreas() {
    return getTemplate('info-row.html')
      .then((html) => {
        page.editorToolbar.insertAdjacentHTML('afterend', html);
        page.postStatusTable.insertAdjacentHTML('beforebegin', html);

        page.postMessageTable = document.querySelectorAll('table.post-info-table');
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
