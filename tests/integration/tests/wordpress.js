// java -jar selenium-server-standalone-2.53.1.jar
// nightwatch --test tests/wordpress.js
var credentials = require('../../../../creds.js');

// Login to WP Dashboard
// Assert that W3-Total Cache banner is not present
// Go to New Post Page
// Assert that W3-Total Cache banner is not present
// Attempt to save a draft with no title
// Test MD > HTML conversion
// Test Capitalize and check button
// Test Capitalize subheadings button
// Test Headline Analysis
// Test Rebuild Link and Copy Link buttons
// Test [author_more] notification
// Test that relative links are flagged
// Test that datepicker works
// Attempt to save a draft with a purely numeric title
// Test that Copy tags button works
// Test that series filter works
// Test that deselecting a category removes it from the Primary Category dropdown
// Test that setting Primary Category to JavaScript sets base syntax to JavaScript
// Test ToC generation
//
// Delete post and exit
//
module.exports = {
  'Test WordPress Mods' : function (browser) {
    browser
      .url('https://www.sitepoint.com/wp-login.php')
      .setValue('#user_login', credentials.username)
      .setValue('#user_pass', credentials.password)
      .click('#wp-submit')

      .assert.hidden("#edge-mode")

      .url('https://www.sitepoint.com/wp-admin/post-new.php')

      .assert.hidden("#edge-mode")

      .click("#save-post")
      .pause(1000)
      .dismiss_alert()

      .waitForElementPresent("#bandaid-md", 5000)
      .setValue("#content", "## level 2 heading\n### level 3 heading")
      .click("#bandaid-md")
      .assert.valueContains("#content", '<h2 id="level2heading">level 2 heading</h2>')
      .assert.valueContains("#content", '<h3 id="level3heading">level 3 heading</h3>')

      .setValue("#title", "this is a test")
      .click("#bandaid-capitalize-and-check")
      .assert.value("#title", 'This Is a Test')

      .click("#bandaid-capitalize-subheadings")
      .waitForElementPresent("#bandaid-modal-body", 1000)
      .click(".actbutton button")
      .assert.valueContains("#content", '<h2 id="level2heading">Level 2 Heading</h2>')
      .assert.valueContains("#content", '<h3 id="level3heading">Level 3 Heading</h3>')

      .click(".headalyze-bar")
      .waitForElementVisible(".headalyze-info", 1000)
      .assert.visible(".headalyze-info")
      .assert.containsText(".headalyze-info", "Headline Analysis Score: 57")
      .click(".headalyze-bar")
      .waitForElementNotVisible(".headalyze-info", 1000)
      .assert.hidden(".headalyze-info")

      .click("#bandaid-rebuild-link")
      .pause(1000)
      .click(".bandaid-copy-link")
      .click("#new-tag-post_tag")
      .keys(browser.Keys.CONTROL)
      .keys("v")
      .assert.valueContains("#new-tag-post_tag", 'https://www.sitepoint.com/')
      .clearValue("#new-tag-post_tag")
      .keys(browser.Keys.NULL)

      .assert.containsText(".proofreader-main-row > td", "Missing [author_more]")
      .setValue("#content", "\n\n[author_more]")
      .pause(2000)
      .assert.containsText(".proofreader-main-row > td", "All good")

      .setValue("#content", '\n\n<a href="www.sitepoint.com">Link</a>')
      .pause(2000)
      .assert.containsText(".proofreader-main-row > td", "Relative link found: www.sitepoint.com")

      .pause(500)
      .assert.containsText("#timestamp", "Publish immediately")
      .click("a.edit-timestamp")
      .assert.elementPresent("#bandaid-datepicker")
      .click("#bandaid-datepicker")
      .waitForElementPresent(".xdsoft_datetimepicker", 1000)
      .pause(500)
      .click(".xdsoft_today")
      .click("#bandaid-datepicker")
      .assert.hidden(".xdsoft_datetimepicker")
      .click("a.save-timestamp")
      .assert.containsText("#timestamp", "Schedule for")

      .click("#edit-slug-buttons button.edit-slug")
      .clearValue("#new-post-slug")
      .setValue("#new-post-slug", "123456789")
      .click("#edit-slug-buttons .button.save")
      .pause(1000)
      .click("#save-post")
      .pause(1000)
      .dismiss_alert()

      .setValue("#new-tag-post_tag", "jamesh, jQuery, awesome")
      .click(".tagadd")
      .assert.containsText(".tagchecklist", "jamesh")
      .click("#bandaid-copy-tags")
      .click("#new-tag-post_tag")
      .keys(browser.Keys.CONTROL)
      .keys("v")
      .assert.valueContains("#new-tag-post_tag", "jamesh, jQuery, awesome")
      .clearValue("#new-tag-post_tag")
      .keys(browser.Keys.NULL)

      .click("#newseries")
      .keys(["a", " ", "g", "u", "i", "d", "e"])
      .assert.cssClassPresent("#series-0", "hidden")
      .assert.cssClassNotPresent("#series-3545", "hidden")
      .keys(browser.Keys.NULL)

      .click("a[href='#category-all']")
      .click("#in-category-407")
      .click("#in-category-407")
      .assert.elementNotPresent("#primary_category option[value='407']")

      .click("#in-category-407")
      .setValue("#primary_category", "JavaScript")
      .assert.value("select[name='base_syntax']", "javascript")
      // Hack, as the setValue call seems to steal focus
      // https://github.com/nightwatchjs/nightwatch/issues/1037
      .click("body")
      .setValue("#primary_category", "Select category")
      .assert.value("select[name='base_syntax']", "")

      // Hack, as the the setValue call seems to steal focus
      .click("body")

      .click("#sp-tools-toc")
      .assert.valueContains("#content", '<li class="toc-h2">')
      .assert.valueContains("#content", '<li class="toc-h3">')

      .click("#delete-action > a")
      .pause(1000)
      .accept_alert()
      .pause(10000)
      .end();
  }
};
