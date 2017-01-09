/* global require, module */

// java -jar selenium-server-standalone-2.53.1.jar
// nightwatch --test tests/mollyguard.js
const credentials = require('../../../../creds.js');

// Login to WP Dashboard
// Go to New Post Page
// Test that publish button is disabled when errors are present in status area
// Test that mollyguard text contains 'Enable publish'
// Test that publish button is re-enabled when errors are removed
// Test that clicking 'Enable publish' link enables the publish button
// Test that clicking 'Enable publish' link changes its text to 'Mollyguard overriden'
//
// Delete post and exit
//
module.exports = {
  'Test mollyguard functionality': (browser) => {
    browser
      .url('https://www.sitepoint.com/wp-login.php')
      .setValue('#user_login', credentials.username)
      .setValue('#user_pass', credentials.password)
      .click('#wp-submit')

      .url('https://www.sitepoint.com/wp-admin/post-new.php')
      .waitForElementPresent('#misc-publishing-actions', 5000)

      .setValue('#content', '<p>yo!</p>')
      .pause(1000)
      .assert.elementPresent('#publish:disabled')
      .assert.visible('#mollyguard')
      .assert.containsText('#mollyguard a span', 'Enable publish')

      .clearValue('#content')
      .pause(1000)
      .assert.elementNotPresent('#publish:disabled')
      .assert.hidden('#mollyguard')

      .setValue('#content', '<p>yo!</p>')
      .pause(1000)
      .assert.elementPresent('#publish:disabled')

      .click('#mollyguard a')
      .assert.elementNotPresent('#publish:disabled')
      .assert.containsText('#mollyguard strong', 'Mollyguard overridden')

      .click('#delete-action > a')
      .pause(1000)
      .accept_alert()
      .pause(10000)
      .end();
  },
};
