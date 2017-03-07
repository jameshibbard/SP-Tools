/* exported Article */
/* global moment, chrome, getTemplate */

'use strict';

const Article = (function Article() {
  const elems = {
    $msAdvertising: $('adblock-msg').parent().parent(),
    $latestCoursesandBooks: $('.ArticleContent_endcap').next().next().next(),
    $emailSubscribe: $('.CategorySubscribeForm'),
    $premiumAds: $('.u-premium-preview'),
    $socialButtons: $('.Sharer'),
    '$sponsors-title': $("h1:contains('Sponsors')"),
    '$sponsors-box': $("h1:contains('Sponsors')").next(),
    $baseThemeAd: $('article-promo').parent(),
    $cheatSheetBox: $('#maestro-524'),
  };

  const $mainHeading = $('h1:first');
  const $linkContainer = $("<div id='link-container'></div>");
  const parselyUrl = `https://dash.parsely.com/sitepoint.com/find?url=${encodeURIComponent(document.URL)}`;

  let API_KEY;
  let SECRET_TOKEN;

  chrome.storage.sync.get(['parselyAPIKey', 'parselySecret'], (items) => {
    API_KEY = items.parselyAPIKey;
    SECRET_TOKEN = items.parselySecret;
  });

  let $toggleElementsLink;
  let $linksTemplate;

  function toggleElements() {
    $.each(elems, (key, $elem) => {
      $elem.toggle();
    });
  }

  function elemsHidden() {
    return localStorage.getItem('elemsHidden');
  }

  function setLinkText(action) {
    $toggleElementsLink.text(`${action} Superfluous Elements`);
  }

  function setInitialLinkState() {
    const i = setInterval(() => {
      if ($('.ArticleAside_row').length) {
        if (elemsHidden()) {
          setLinkText('Show');
          toggleElements();
        }

        clearInterval(i);
      }
    }, 500);
  }

  function handleToggleLinkClick() {
    if (elemsHidden()) {
      setLinkText('Hide');
      localStorage.removeItem('elemsHidden');
    } else {
      setLinkText('Show');
      localStorage.setItem('elemsHidden', 'true');
    }

    toggleElements();
  }

  function addToggleLink() {
    $toggleElementsLink = $('<a />', {
      href: '#',
      text: 'Hide Superfluous Elements',
      id: 'bandaid-toggle-link',
      title: 'Remove all the superfluous stuff',
      click(e) {
        e.preventDefault();
        handleToggleLinkClick();
      },
    });

    $linkContainer.append($toggleElementsLink);
  }

  function buildApiUrl(postUrl, days) {
    const apiUrl = 'https://api.parsely.com/v2/analytics/post/detail?url=' +
                    encodeURIComponent(postUrl) +
                    '&apikey=' + API_KEY +
                    '&secret=' + SECRET_TOKEN +
                    '&days=' + days;
    return apiUrl;
  }

  function displayTotalHits(postUrl, $link) {
    const publishedOn = $("meta[property='article:published_time']").attr('content');
    const days = moment().diff(moment(publishedOn), 'days') + 1;

    $.getJSON(buildApiUrl(postUrl, days), (json) => {
      if (json.data) {
        const hits = json.data[0]._hits;
        $link.replaceWith(`${hits} views in ${days} days`);
      } else {
        $link.replaceWith('Error :(');
      }
    });
  }

  function attachEventHandlers() {
    $(document).on('click', '.get-total-views', function (e) {
      e.preventDefault();

      const postUrl = window.location.origin + window.location.pathname;
      $(this).text('fetching ...').fadeIn(1000);
      displayTotalHits(postUrl, $(this));
    });
  }

  function init() {
    $linkContainer.insertAfter($mainHeading.next());

    getTemplate('parsely-links.html')
    .then((html) => {
      $linksTemplate = html;
      addToggleLink();
      setInitialLinkState();

      $linkContainer
        .append('&nbsp;&nbsp;|&nbsp;&nbsp;')
        .append($linksTemplate);

      $('.open-parsely').attr('href', parselyUrl);
      attachEventHandlers();
    });
  }

  return {
    init,
  };
}());
