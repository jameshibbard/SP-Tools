// java -jar selenium-server-standalone-2.53.1.jar
// nightwatch --test tests/channel.js

// Go to JavaScript Channel page
// Test "Toggle Elements" link toggles superfluous elements
// Test that the correct CSS values are being applied to the article containers on toggle.
//
// Test that Parsely links are added to content tiles
// Test that when clicked, Get Total Views is replaced with "fetching"
// Test that Parsely links are added to tiles loaded dynamically (infinite scroll)
//
// Go to Ruby Channel page
// Test "Toggle Elements" link state persists
// Go to JavaScript Channel page
// Test "Toggle Elements" link state persists
//
module.exports = {
  'Test Main Channel Mods' : function (browser) {
    browser
      .url('https://www.sitepoint.com/javascript')
      .waitForElementPresent("#bandaid-toggle-link", 5000)

      .assert.visible("main > div:first-child")
      .assert.containsText("#bandaid-toggle-link", "Hide Superfluous Elements")

      .click("#bandaid-toggle-link")

      .assert.hidden("main > div:first-child")
      .assert.containsText("#bandaid-toggle-link", "Show Superfluous Elements")
      .assert.cssProperty(".sp🚧 .l-pv4", "padding", "0px")

      .click("#bandaid-toggle-link")

      .assert.visible("main > div:first-child")
      .assert.containsText("#bandaid-toggle-link", "Hide Superfluous Elements")
      .assert.cssProperty(".sp🚧 .l-pv4", "padding", "32px 0px")

      .click("#bandaid-toggle-link")

      .assert.visible(".parsely-link-block")
      .assert.visible(".open-parsely")
      .assert.visible(".get-total-views")

      .click(".get-total-views")
      .assert.containsText(".get-total-views", "fetching")

      .elements('css selector','.parsely-link-block', function (result) {
        browser.assert.equal(result.value.length, 24);
      })

      .execute('scrollTo(0,5000)')
      .pause(2000)

      .elements('css selector','.parsely-link-block', function (result) {
        browser.assert.ok(result.value.length > 24);
      })

      .url('https://www.sitepoint.com/ruby/')
      .waitForElementVisible("#bandaid-toggle-link", 5000)

      .assert.hidden("main > div:first-child")
      .assert.containsText("#bandaid-toggle-link", "Show Superfluous Elements")
      .click("#bandaid-toggle-link")

      .url('https://www.sitepoint.com/javascript')
      .waitForElementVisible("#bandaid-toggle-link", 5000)

      .assert.visible("main > div:first-child")
      .assert.containsText("#bandaid-toggle-link", "Hide Superfluous Elements")

      .end();
  }
};
