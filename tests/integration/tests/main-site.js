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
      .assert.not.elementPresent('#skip-navigation + div') // Job banner
      .assert.not.elementPresent('div[type="book"]') // Advert next to article header
      .assert.not.elementPresent('div[type="books_new"]') // New books in sidebar
      .assert.not.elementPresent('div[class^="styledPopularBooks__StyledPopularBooks"]') // Popular books in sidebar
      .assert.not.elementPresent('.qc-cmp-persistent-link') // Privacy popup trigger
      .assert.not.elementPresent('.sp-smartbar'); // Offers bar
  },

  'Test Post Page Mods': (browser) => {
    const today = new Date();
    const toDate = today.toISOString().substring(0, 10).replace(/-/g, '');

    browser
      .url('https://www.sitepoint.com/zsh-commands-plugins-aliases-tools/')

      // Wait for everything to load
      .pause(3000)

      // Test that superfluous elements are hidden
      .assert.not.elementPresent('.qc-cmp-persistent-link') // Privacy popup trigger
      .assert.not.elementPresent('.sp-smartbar') // Offers bar
      .assert.not.elementPresent('.qc-cmp-persistent-link') // Privacy popup trigger

      // Test Google Analytics Link
      .assert.elementPresent('.ga-link') // Web push notifications widget
      .assert.attributeContains('.ga-link', 'href', `https://analytics.google.com/analytics/web/#/report/content-pages/a30131w52693p266/_u.date00=20200303&_u.date01=${toDate}&explorer-table.plotKeys=%5B%5D&_r.drilldown=analytics.pagePath:~2Fwww.sitepoint.com~2Fzsh-commands-plugins-aliases-tools~2F`)

      .end();
  },
};
