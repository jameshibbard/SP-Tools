/* exported CategoriesWidget */
/* global chrome */

'use strict';

const CategoriesWidget = (function CategoriesWidget() {
  const $addCategoryLink = $('#category-add-toggle');
  const $categoryListItems = $('div#category-all>ul>li');

  let channel;

  const mappings = {
    'html-css': 6523,
    javascript: 407,
    php: 37,
    ruby: 8,
    mobile: 410,
    'design-ux': 6131,
    entrepreneur: 6132,
    web: 422,
    wordpress: 5849,
    java: 435,
  };

  function toggleMyCategories() {
    const checked = this.checked;

    // Move this otside of event handler
    chrome.storage.sync.get(['sitepointChannel'], (items) => {
      channel = items.sitepointChannel;
      const categoryID = `category-${mappings[channel]}`;

      if (channel === 'none') return;

      $categoryListItems.each(function toggle() {
        if (checked && this.id !== categoryID) {
          this.style.display = 'none';
        } else {
          this.style.display = 'block';
        }
      });
    });
  }

  function addToggleCategoriesLink() {
    const $toggleCategoriesLink = $('<input />', {
      type: 'checkbox',
      style: 'float: right; margin-top: 15px;',
      click: toggleMyCategories,
    });

    $addCategoryLink.after($toggleCategoriesLink);
  }

  return {
    init() {
      addToggleCategoriesLink();
    },
  };
}());
