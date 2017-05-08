/* global require, module */

// java -jar selenium-server-standalone-2.53.1.jar
// nightwatch --test tests/wordpress.js
const credentials = require('../../../../creds.js');

// Login to WP Dashboard
// Go to New Post Page
// Assert empty document displays as 'All good'
// Test MD > HTML conversion
// Test Capitalize and check button
// Test Capitalize subheadings button
// Test Headline Analysis
// Test Rebuild Link and Copy Link buttons
// Test [author_more] notification
// Test Premium link notification
// Test that relative links and empty links are flagged
// Test that h1 tags are flagged
// Test that [author_more] and peer review credit in excerpt are flagged
// Test that [special] shortcode is converted to HTML equivalent
// Test that incorrect URL is flagged
// Test ToC generation
// Test that datepicker works
// Test that Copy tags button works
// Test that series filter works
// Test that deselecting a category removes it from the Primary Category dropdown
// Test that setting Primary Category to JavaScript sets base syntax to JavaScript
//
// Delete post and exit
//
module.exports = {
  'Test WordPress Mods': (browser) => {
    browser
      .url('https://www.sitepoint.com/wp-login.php')
      .setValue('#user_login', credentials.username)
      .setValue('#user_pass', credentials.password)
      .click('#wp-submit')

      .url('https://www.sitepoint.com/wp-admin/post-new.php')

      .waitForElementPresent('#bandaid-md', 5000)

      .assert.containsText('.proofreader-main-row > td', 'All good')

      .setValue('#content', '## level 2 heading\n### level 3 heading')
      .click('#bandaid-md')
      .assert.valueContains('#content', '<h2 id="level2heading">level 2 heading</h2>')
      .assert.valueContains('#content', '<h3 id="level3heading">level 3 heading</h3>')

      .setValue('#title', 'this is a test')
      .click('#bandaid-capitalize-and-check')
      .assert.value('#title', 'This Is a Test')

      .click('#bandaid-capitalize-subheadings')
      .waitForElementPresent('#bandaid-modal-body', 1000)
      .click('.actbutton button')
      .assert.valueContains('#content', '<h2 id="level2heading">Level 2 Heading</h2>')
      .assert.valueContains('#content', '<h3 id="level3heading">Level 3 Heading</h3>')

      .click('.headalyze-bar')
      .waitForElementVisible('.headalyze-info', 1000)
      .assert.visible('.headalyze-info')
      .assert.containsText('.headalyze-info', 'Headline Analysis Score: 57')
      .click('.headalyze-bar')
      .waitForElementNotVisible('.headalyze-info', 1000)
      .assert.hidden('.headalyze-info')

      .setValue('#title', ', So it is!')
      .pause(1000)
      .click('#bandaid-rebuild-link')
      .pause(1500)
      .click('.bandaid-copy-link')
      .click('#new-tag-post_tag')
      .keys(browser.Keys.CONTROL)
      .keys('v')
      .assert.valueContains('#new-tag-post_tag', 'https://www.sitepoint.com/this-is-a-test-so-it-is')
      .clearValue('#new-tag-post_tag')
      .keys(browser.Keys.NULL)

      .assert.containsText('.proofreader-main-row > td', 'Missing [author_more]')
      .assert.containsText('.proofreader-main-row > td', 'No SitePoint Premium link found')

      .setValue('#content', '\n\n[author_more]\n\n<a href="https://www.sitepoint.com/premium/courses/introduction-to-javascript-2908"></a>')
      .pause(2000)
      .assert.containsText('.proofreader-main-row > td', 'All good')

      .setValue('#content', '\n\n<a href="www.sitepoint.com">Link</a>')
      .pause(2000)
      .assert.containsText('.proofreader-main-row > td', 'Relative link found: www.sitepoint.com')

      .setValue('#content', '\n\n<a href="">Link</a>')
      .pause(2000)
      .assert.containsText('.proofreader-main-row > td', 'empty href')

      .setValue('#content', '\n\n<h1>What a nice heading!</h1>')
      .pause(2000)
      .assert.containsText('.proofreader-main-row > td', 'H1 tag found!')

      .setValue('#excerpt', 'This article was peer reviewed by God [author_more]')
      .pause(2000)
      .assert.containsText('.proofreader-main-row > td', 'Excerpt contains [author_more] shortcode, peer review credit')

      .pause(500)
      .clearValue('#excerpt')

      .setValue('#excerpt', '[special]I iz speshul![/special]\n\n<p>Awesome content here</p>')
      .pause(2000)
      .assert.valueContains('#excerpt', '<p class="wp-special">I iz speshul!</p>\n\n<p>Awesome content here</p>')

      .clearValue('#title')
      .setValue('#title', '123456789')
      .click('#bandaid-rebuild-link')
      .pause(2000)
      .assert.containsText('.proofreader-main-row > td', 'Post URL appears incorrect')

      .click('body')
      .click('#sp-tools-toc')
      .assert.valueContains('#content', '<li class="toc-h2">')
      .assert.valueContains('#content', '<li class="toc-h3">')

      .pause(500)
      .clearValue('#excerpt')
      .clearValue('#content')
      .setValue('#content', `
        <h2>JavaScript</h2>
        [author_more]
        <a href="https://www.sitepoint.com/premium/courses/introduction-to-javascript-2908"></a>
      `)

      .clearValue('#title')
      .setValue('#title', 'this is a test')
      .click('#bandaid-rebuild-link')

      .pause(2000)
      .assert.containsText('.proofreader-main-row > td', 'All good')

      .pause(500)
      .assert.containsText('#timestamp', 'Publish immediately')
      .click('a.edit-timestamp')
      .assert.elementPresent('#bandaid-datepicker')
      .click('#bandaid-datepicker')
      .waitForElementPresent('.xdsoft_datetimepicker', 1000)
      .pause(500)
      .click('.xdsoft_today')
      .click('#bandaid-datepicker')
      .assert.hidden('.xdsoft_datetimepicker')
      .click('a.save-timestamp')
      .assert.containsText('#timestamp', 'Schedule for')

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

      .click('#newseries')
      .keys(['a', ' ', 'g', 'u', 'i', 'd', 'e'])
      .assert.cssClassPresent('#series-0', 'hidden')
      .assert.cssClassNotPresent('#series-3545', 'hidden')
      .keys(browser.Keys.NULL)

      .click('a[href="#category-all"]')
      .click('#in-category-407')
      .click('#in-category-407')
      .assert.elementNotPresent('#primary_category option[value="407"]')

      .click('#in-category-407')
      .setValue('#primary_category', 'JavaScript')
      .assert.value('select[name="base_syntax"]', 'javascript')
      // Hack, as the setValue call seems to steal focus
      // https://github.com/nightwatchjs/nightwatch/issues/1037
      .click('body')
      .setValue('#primary_category', 'Select category')
      .assert.value('select[name="base_syntax"]', '')

      // Hack, as the the setValue call seems to steal focus
      .click('body')

      .click('#delete-action > a')
      .pause(1000)
      .accept_alert()
      .pause(10000)
      .end();
  },
};
