/* exported PublishWidget */

'use strict';

const PublishWidget = (function PublishWidget() {
  const $timeStampDiv = $('#timestampdiv');
  const $wpSchedulePostDropdown = $('.timestamp-wrap'); // WP own schedule dropdown

  let $datepicker;

  // WP default datetime field IDs
  // mm = month / 01 - 12
  // jj = day
  // aa = year 4 digit
  // hh = hour
  // mn = min
  const $dd = $('#jj');
  const $mm = $('#mm');
  const $yyyy = $('#aa');
  const $hh = $('#hh');
  const $mn = $('#mn');

  function addDatePicker() {
    $datepicker = $('<input />', {
      id: 'bandaid-datepicker',
      type: 'text',
      placeholder: 'Date and time',
    });

    $datepicker.datetimepicker();
    $timeStampDiv.prepend($datepicker);
  }

  function attachEventHandlers() {
    $datepicker.on('change', function updateDateFields() {
      // String in format yyyy/mm/dd hh:mm
      const dateString = this.value;

      $yyyy.val(dateString.substr(0, 4));
      $mm.val(dateString.substr(5, 2));
      $dd.val(dateString.substr(8, 2));
      $hh.val(dateString.substr(11, 2));
      $mn.val(dateString.substr(14, 2));
    });
  }

  return {
    init() {
      addDatePicker();
      $wpSchedulePostDropdown.remove();
      attachEventHandlers();
    },
  };
}());
