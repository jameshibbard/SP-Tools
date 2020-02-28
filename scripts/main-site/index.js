/* exported MainSite */
/* global chrome, moment */

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
    const dateString = document
      .querySelector('ol.Article_breadcrumb')
      .children
      .item(1)
      .textContent
      .trim();

    const fromDate = moment(new Date(dateString)).format('YYYYMMDD');
    const toDate = moment(new Date()).format('YYYYMMDD');
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
    document.querySelector('h1').insertAdjacentElement('afterend', gaLink);
  }

  function init() {
    const pageHasArticleMetaTag = document.querySelectorAll('meta[content="article"]').length;
    const pageHasTopLevelHeading = document.querySelectorAll('h1').length;
    const isArticle = pageHasArticleMetaTag && pageHasTopLevelHeading;

    if (isArticle) attachGoogleAnalyticsLink();

    // Is 'clean-up-ui' set in the options?
    chrome.storage.sync.get(['clean-up-ui'], (res) => {
      if (!res['clean-up-ui']) return;

      // Elements to remove
      // Don't mess with the modals, as that kills scrollings
      [
        'sp-social-share', // Share widget
        '.sendpulse-prompt', // Web push notifications widget
        '.acsb-trigger', // Accesiblity widget
        'featured-posts', // Featured posts, obvs
        '#navigation-bar+.NavBar_offsetSpacer', // Spacer for sticky nav bar
        '.qc-cmp-persistent-link', // Privacy popup trigger
        '.sp-smartbar', // Offers bar
      ]
        .forEach((selector) => removeElement(selector));

      // Make navbar unsticky
      document.querySelector('#navigation-bar').classList.remove('l-p-fix');

      // Remove smartbar offset
      document.body.style['margin-top'] = 0;
    });
  }

  return {
    init,
  };
}());
