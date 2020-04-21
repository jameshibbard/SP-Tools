/* global require, module */

// npm run nightwatch tests/integration/tests/wordpress.js
// Ensure that superfluous elements are hidden on the WP new post page, as otherwise
// Nightwatch has a problem finding the elements it expects to be in view.

const credentials = require('../../../../creds.js');

module.exports = {
  'Test WordPress Mods': (browser) => {
    browser
      // Login to WP Dashboard
      .url('https://editor.sitepoint.com/wp-login.php')
      .setValue('#user_login', credentials.username)
      .setValue('#user_pass', credentials.password)
      .click('#wp-submit')

      // Go to New Post Page
      .url('https://editor.sitepoint.com/wp-admin/post-new.php')

      // Assert empty document displays as 'All good'
      .waitForElementPresent('#bandaid-md', 5000)
      .assert.containsText('.proofreader-main-row > td', 'All good')

      // Test rel=sponsored toggle
      .setValue('#content', '[SitePoint](https://sitepoint.com)\n[Twitter](https://twitter.com/jchibbard?lang=en)')
      .click('#bandaid-md')
      .assert.valueContains('#content', '<a href="https://sitepoint.com">SitePoint</a>')
      .assert.valueContains('#content', '<a href="https://twitter.com/jchibbard?lang=en">Twitter</a>')
      .click('#rel-sponsored-toggle')
      .assert.valueContains('#content', '<a href="https://sitepoint.com" rel="sponsored">SitePoint</a>')
      .assert.valueContains('#content', '<a href="https://twitter.com/jchibbard?lang=en" rel="sponsored">Twitter</a>')
      .click('#rel-sponsored-toggle')
      .assert.valueContains('#content', '<a href="https://sitepoint.com">SitePoint</a>')
      .assert.valueContains('#content', '<a href="https://twitter.com/jchibbard?lang=en">Twitter</a>')

      // Test MD > HTML conversion
      .setValue('#content', '## level 2 heading\n### level 3 heading')
      .click('#bandaid-md')
      .assert.valueContains('#content', '<h2 id="level2heading">level 2 heading</h2>')
      .assert.valueContains('#content', '<h3 id="level3heading">level 3 heading</h3>')

      // Test Capitalize and check button
      .setValue('#title', 'this is a test')
      .click('#bandaid-capitalize-and-check')
      .assert.value('#title', 'This Is a Test')

      // Test Capitalize subheadings button
      .click('#bandaid-capitalize-subheadings')
      .waitForElementPresent('#bandaid-modal-body', 1000)
      .click('.actbutton button')
      .assert.valueContains('#content', '<h2 id="level2heading">Level 2 Heading</h2>')
      .assert.valueContains('#content', '<h3 id="level3heading">Level 3 Heading</h3>')

      // Test Headline Analysis
      .click('.headalyze-bar')
      .waitForElementVisible('.headalyze-info', 1500)
      .assert.visible('.headalyze-info')
      .assert.containsText('.headalyze-info', 'Headline Analysis Score: 57')
      .click('.headalyze-bar')
      .waitForElementNotVisible('.headalyze-info', 1500)
      .assert.not.visible('.headalyze-info')

      // Test Rebuild Link button
      .setValue('#title', ', So it is!')
      .pause(1000)
      .click('#bandaid-rebuild-link')
      .pause(1000)

      // Test Copy Link button
      .click('.bandaid-copy-link')
      .click('#new-tag-post_tag')
      .keys(browser.Keys.CONTROL)
      .keys('v')
      .assert.valueContains('#new-tag-post_tag', 'https://www.sitepoint.com/this-is-a-test-so-it-is')
      .clearValue('#new-tag-post_tag')
      .keys(browser.Keys.NULL)

      // Mollyguard in editor pane
      //
      // Test that relative links are flagged
      .setValue('#content', '\n\n<a href="www.sitepoint.com">Link</a>')
      .pause(2000)
      .assert.containsText('.proofreader-main-row > td', 'Relative link found: www.sitepoint.com')

      // Test that empty links are flagged
      .setValue('#content', '\n\n<a href="">Link</a>')
      .pause(2000)
      .assert.containsText('.proofreader-main-row > td', 'empty href')

      // Test that h1 tags are flagged
      .setValue('#content', '\n\n<h1>What a nice heading!</h1>')
      .pause(2000)
      .assert.containsText('.proofreader-main-row > td', 'H1 tag found!')

      // Test that incorrect URL is flagged
      .clearValue('#title')
      .setValue('#title', '123456789')
      .click('#bandaid-rebuild-link')
      .pause(2000)
      .assert.containsText('.proofreader-main-row > td', 'Post URL appears incorrect')

      // Mollyguard in excerpt pane
      //
      // Test that [special] shortcode is converted to HTML equivalent
      .setValue('#excerpt', '[special]I iz speshul![/special]\n\n<p>Awesome content here</p>')
      .pause(2000)
      .assert.valueContains('#excerpt', '<p class="wp-special">I iz speshul!</p>\n\n<p>Awesome content here</p>')

      // Reset everything
      .pause(500)
      .clearValue('#excerpt')
      .clearValue('#content')
      .setValue('#content', '<h2>JavaScript</h2><p>The best language going!</p>')

      .clearValue('#title')
      .setValue('#title', 'this is a test')
      .click('#bandaid-rebuild-link')

      .pause(2000)
      .assert.containsText('.proofreader-main-row > td', 'All good')

      // Test that datepicker works
      .pause(500)
      .assert.containsText('#timestamp', 'Publish immediately')
      .click('a.edit-timestamp')
      .assert.elementPresent('#bandaid-datepicker')
      .click('#bandaid-datepicker')
      .waitForElementPresent('.xdsoft_datetimepicker', 1000)
      .pause(500)
      .click('td.xdsoft_today')
      .click('#bandaid-datepicker')
      .pause(500)
      .assert.not.visible('.xdsoft_datetimepicker')
      .click('a.save-timestamp')
      .assert.containsText('#timestamp', 'Schedule for')

      // Test that Copy tags button works
      .setValue('#new-tag-post_tag', 'jamesh, jQuery, awesome')
      .click('.tagadd')
      .assert.containsText('.tagchecklist', 'jamesh')
      .click('#bandaid-copy-tags')
      .click('#new-tag-post_tag')
      .keys(browser.Keys.CONTROL)
      .keys('v')
      .assert.valueContains('#new-tag-post_tag', 'jamesh, jQuery, awesome')
      .clearValue('#new-tag-post_tag')
      .keys(browser.Keys.NULL)

      // Delete post and exit
      .click('#delete-action > a')
      .pause(1000)
      .acceptAlert()
      .pause(10000)
      .end();
  },
};
