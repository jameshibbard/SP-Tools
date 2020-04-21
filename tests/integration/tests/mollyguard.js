/* global require, module */

// npm run nightwatch tests/integration/tests/mollyguard.js

const credentials = require('../../../../creds.js');

module.exports = {
  'Test mollyguard functionality': (browser) => {
    browser
      // Login to WP Dashboard
      .url('https://editor.sitepoint.com/wp-login.php')
      .setValue('#user_login', credentials.username)
      .setValue('#user_pass', credentials.password)
      .click('#wp-submit')

      // Go to New Post Page
      .url('https://editor.sitepoint.com/wp-admin/post-new.php')
      .waitForElementPresent('#misc-publishing-actions', 5000)

      // Test that publish button is disabled when errors are present in status area
      .setValue('#content', '<h1>Top level headings are forbidden</h1>')
      .pause(1000)
      .assert.elementPresent('#publish:disabled')

      // Test that mollyguard text contains 'Enable publish'
      .assert.visible('#mollyguard')
      .assert.containsText('#mollyguard a span', 'Enable publish')

      // Test that publish button is re-enabled when errors are removed
      .clearValue('#content')
      .pause(1000)
      .assert.elementNotPresent('#publish:disabled')
      .assert.hidden('#mollyguard')

      // Make mollyguard kick back in
      .setValue('#content', '<h1>Top level headings are forbidden</h1>')
      .pause(1000)
      .assert.elementPresent('#publish:disabled')

      // Test that clicking 'Enable publish' link enables the publish button
      .click('#mollyguard a')
      .assert.elementNotPresent('#publish:disabled')

      // Test that clicking 'Enable publish' link changes its text to 'Mollyguard overriden'
      .assert.containsText('#mollyguard strong', 'Mollyguard overridden')

      // No post to delete, so just bail
      .pause(5000)
      .end();
  },
};
