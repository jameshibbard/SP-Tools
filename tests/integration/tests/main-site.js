/* global module */
/* eslint-disable prefer-arrow-callback */

// npm run nightwatch tests/integration/tests/main-site.js

module.exports = {
  'Test Channel Page Mods': (browser) => {
    browser
      .url('https://www.sitepoint.com/javascript/')

      // Wait for everything to load
      .pause(3000)

      // Test that superfluous elements are hidden
      .assert.not.elementPresent('.sendpulse-prompt') // Web push notifications widget
      .assert.not.elementPresent('.acsb-trigger') // Accesiblity widget
      .assert.not.elementPresent('featured-posts') // Featured posts, obvs
      .assert.not.elementPresent('.qc-cmp-persistent-link') // Privacy popup trigge
      .assert.not.elementPresent('.sp-smartbar') // Offers bar

      // Test that nav bar is no longer sticky
      // assert.visible returns true for offscreen elements, so a custom function is required
      // https://github.com/nightwatchjs/nightwatch/issues/2288
      // Need to disable ES6 arrow functions, as .execute() cannot deal with them
      .moveToElement('footer', 0, 0)
      .pause(1000)
      .execute(
        function getNavbarPOsition() {
          return document.querySelector('#navigation-bar').getBoundingClientRect().top;
        },
        [],
        function isOutsideViewport(res) {
          browser.assert.ok(res.value < 0, 'Navbar is off screen');
        },
      );
  },

  'Test Post Page Mods': (browser) => {
    browser
      .url('https://www.sitepoint.com/zsh-commands-plugins-aliases-tools/')

      // Wait for everything to load
      .pause(3000)

      // Test that superfluous elements are hidden
      .assert.not.elementPresent('.sendpulse-prompt') // Web push notifications widget
      .assert.not.elementPresent('.acsb-trigger') // Accesiblity widget
      .assert.not.elementPresent('sp-social-share') // Share widget
      .assert.not.elementPresent('.qc-cmp-persistent-link') // Privacy popup trigge
      .assert.not.elementPresent('.sp-smartbar') // Offers bar

      // Test Google Analytics Link
      .assert.elementPresent('.ga-link') // Web push notifications widget
      .assert.attributeContains('.ga-link', 'href', 'https://analytics.google.com/analytics/web/#/report/content-pages/a30131w52693p266/_u.date00=20200303&_u.date01=20200305&explorer-table.plotKeys=%5B%5D&_r.drilldown=analytics.pagePath:~2Fwww.sitepoint.com~2Fzsh-commands-plugins-aliases-tools~2F')

      // Test that nav bar is no longer sticky
      .moveToElement('footer', 0, 0)
      .pause(1000)
      .execute(
        function getNavbarPOsition() {
          return document.querySelector('#navigation-bar').getBoundingClientRect().top;
        },
        [],
        function isOutsideViewport(res) {
          browser.assert.ok(res.value < 0, 'Navbar is off screen');
        },
      )

      .end();
  },
};
