/* global chrome */

'use strict';

const MainSite = (function MainSite() {
  function buildGoogleAnalyticsHref() {
    // Grab time in yyyy-mm-dd format
    const time = document.querySelector('time');
    const fromDate = time.getAttribute('dateTime').replace(/-/g, '');

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
    // When infinite scroll is enabled, we can have more than one h1 element
    const headings = document.querySelectorAll('h1');
    const mostRecentHeading = headings[headings.length - 1];
    const header = mostRecentHeading.parentElement;
    const headerHasLink = header.querySelector('.ga-link');

    const gaLink = document.createElement('a');
    gaLink.setAttribute('href', buildGoogleAnalyticsHref());
    gaLink.textContent = 'Open in Google Analytics';
    gaLink.setAttribute('class', 'ga-link m1pdrmq3');
    gaLink.target = '_blank';

    // Check for presence of link, as AMP periodically triggers urlchange
    if (!headerHasLink) header.appendChild(gaLink);
  }

  function init() {
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
      document.body.classList.add('clean-up-ui');
    });

    const isArticle = document.querySelectorAll('div[aria-label="Article sidebar"]').length;
    // Attach link with slight delay, as otherwise it sometimes vanishes again
    if (isArticle) setTimeout(attachGoogleAnalyticsLink, 1000);
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
        // Runs on subsequent navigation
        if (isSitePoint && !isWordPress) MainSite.init();
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
// Runs once when site loads
if (isSitePoint && !isWordPress) MainSite.init();
