// java -jar selenium-server-standalone-2.53.1.jar
// nightwatch --test tests/channels.js

// Go to an article page
// Test "Toggle Elements" link toggles superfluous elements
//
// Test that Parsely links are added to the header
// Test that when clicked, Get Total Views is replaced with "fetching"
// Test that href value of "Open in Parsely" is correct
// Test that SPP sticky footer is hidden
//
// Go to JavaScript Channel page
// Test "Toggle Elements" link state persists
//
module.exports = {
  'Test Post Page Mods' : function (browser) {
    browser
      .url('https://www.sitepoint.com/quick-tip-persist-checkbox-checked-state-after-page-reload/')
      .waitForElementPresent("#bandaid-toggle-link", 5000)

      .assert.visible("div.CategorySubscribeForm")
      .assert.containsText("#bandaid-toggle-link", "Hide Superfluous Elements")

      .click("#bandaid-toggle-link")

      .assert.hidden("div.CategorySubscribeForm")
      .assert.containsText("#bandaid-toggle-link", "Show Superfluous Elements")

      .assert.visible(".parsely-link-block")
      .assert.visible(".open-parsely")
      .assert.visible(".get-total-views")

      .click(".get-total-views")
      .assert.containsText(".get-total-views", "fetching")

      .assert.attributeContains(".open-parsely", "href", "https://dash.parsely.com/sitepoint.com/find?url=https%3A%2F%2Fwww.sitepoint.com%2Fquick-tip-persist-checkbox-checked-state-after-page-reload%2F")

      .execute('scrollTo(0,5000)')
      .assert.hidden(".NavBar_stickyZone")

      .url('https://www.sitepoint.com/javascript/')
      .waitForElementVisible("#bandaid-toggle-link", 5000)

      .assert.hidden("main > div:first-child")
      .assert.containsText("#bandaid-toggle-link", "Show Superfluous Elements")

      .end();
  }
};
