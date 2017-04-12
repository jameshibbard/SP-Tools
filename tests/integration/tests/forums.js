// java -jar selenium-server-standalone-2.53.1.jar
// nightwatch --test tests/channels.js

// Go to forums
// Test that banner image at the top of every page is hidden
//
module.exports = {
  'Test Forums Mods' : function (browser) {
    browser
      .url('https://www.sitepoint.com/community/')
      .waitForElementVisible('body', 3000)
      .assert.hidden("#main-outlet > .container > div > a > img")
      .end();
  }
};
