/* exported SeriesWidget */

'use strict';

const SeriesWidget = (function SeriesWidget() {
  const $seriesInput = $('#newseries');
  const $seriesChecklist = $('#serieschecklist li');

  function addInstaFilter() {
    $seriesInput.on('keyup', () => {
      const text = $seriesInput.val().toLowerCase();

      if (text === '') {
        $seriesChecklist.removeClass('hidden');
        return;
      }

      $.each($seriesChecklist, (index, listItem) => {
        const seriesName = $(listItem).text().toLowerCase();

        if (seriesName.indexOf(text) > -1) {
          $(listItem).removeClass('hidden');
        } else {
          $(listItem).addClass('hidden');
        }
      });
    });
  }

  function init() {
    addInstaFilter();
  }

  return {
    init,
  };
}());
