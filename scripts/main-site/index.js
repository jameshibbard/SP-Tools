/* global chrome */

'use strict';

const MainSite = (function MainSite() {
  function removeElement(selector, timeElapsed = 0) {
    const interval = 250;
    const maxDelay = 10000;
    const el = document.querySelector(selector);

    if (timeElapsed > maxDelay) return;

    if (el) {
      el.parentNode.removeChild(el);
    } else {
      window.setTimeout(() => {
        const newTimeElapsed = timeElapsed + interval;
        removeElement(selector, newTimeElapsed);
      }, interval);
    }
  }

  function buildGoogleAnalyticsHref() {
    const meta = document.querySelector('div[class^="styledHeader__Metabox"]');
    const time = meta.querySelector('time');
    const fromDate = time.getAttribute('datetime').replace(/-/g, '');

    // Use the toISOString function to get today's date as yyyymmdd
    // https://stackoverflow.com/a/28431880
    const today = new Date();
    const toDate = today.toISOString().substring(0, 10).replace(/-/g, '');

    const slug = window.location.href
      .replace('https://www.sitepoint.com/', '')
      .replace(/\/$/, '');

    const gaUrl = `https://analytics.google.com/analytics/web/#/report/content-pages/a30131w52693p266/_u.date00=${
      fromDate
    }&_u.date01=${
      toDate
    }&explorer-table.plotKeys=%5B%5D&_r.drilldown=analytics.pagePath:~2Fwww.sitepoint.com~2F${
      slug
    }~2F`;

    return gaUrl;
  }

  function attachGoogleAnalyticsLink() {
    const gaLink = document.createElement('a');
    gaLink.setAttribute('href', buildGoogleAnalyticsHref());
    gaLink.textContent = 'Open in Google Analytics';
    gaLink.setAttribute('class', 'ga-link');
    gaLink.target = '_blank';

    // When infinite scroll is enabled, we can have more than one h1 element
    const headings = document.querySelectorAll('h1');
    const mostRecentHeading = headings[headings.length - 1];
    mostRecentHeading.insertAdjacentElement('afterend', gaLink);
  }

  function init() {
    const isArticle = document.querySelectorAll('article[aria-label^="Article title:"]').length;

    if (isArticle) attachGoogleAnalyticsLink();

    // Is 'infinite-scroll' set in the options?
    chrome.storage.sync.get(['infinite-scroll'], (res) => {
      if (!res['infinite-scroll']) return;
      document.body.classList.add('infinite-scroll-disabled');

      window.addEventListener('scroll', (event) => {
        event.stopPropagation();
      }, true);
    });

    // Is 'clean-up-ui' set in the options?
    chrome.storage.sync.get(['clean-up-ui'], (res) => {
      if (!res['clean-up-ui']) return;

      // Elements to remove
      // Don't mess with the modals, as that kills scrolling
      [
        'a.qc-cmp-persistent-link', // Privacy popup trigger
        '#skip-navigation + div', // Job banner
        'div[type="book"]', // advert next to article header
        'div[type="books_new"]', // new books in sidebar
        'div[class^="styledPopularBooks__StyledPopularBooks"]', // popular books in sidebar
        'a.qc-cmp-persistent-link', // Privacy popup trigger
        '.qc-cmp-ui-container', // Privacy popup
        '.sp-smartbar', // Offers bar
        'h1 + div + div', // Featured posts. Past caring, frankly...
        'a.qc-cmp-persistent-link', // Privacy popup trigger again, as it often gets added back in
      ]
        .forEach((selector) => removeElement(selector));

      // Remove smartbar offset
      document.body.style['margin-top'] = 0;

      // Undo the overflow:hidden property applied to the body by the privacy popup
      document.body.style.overflow = 'auto';
    });
  }

  return {
    init,
  };
}());

const isSitePoint = window.location.origin.indexOf('sitepoint.com') !== -1;
const isWordPress = window.location.pathname.indexOf('wp-admin') !== -1;

// Responds to context menu options & URL change
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.text) {
    switch (msg.text) {
      case 'urlChanged':
        if (isSitePoint && !isWordPress) {
          MainSite.init();
        }
        // https://support.google.com/chrome/thread/2047906?hl=en&msgid=13138318
        sendResponse(true);
        break;
      case 'getTitle':
        sendResponse(document.querySelector('title').textContent);
        break;
      case 'getDesc':
        sendResponse(document.querySelector('meta[name="description"]').getAttribute('content'));
        break;
      default:
        sendResponse(true);
    }
  }
});

// Only run on sitepoint.com main site
if (isSitePoint && !isWordPress) MainSite.init();
