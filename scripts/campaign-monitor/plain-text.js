'use strict';

const PlainTextView = (function PlainTextView() {
  const $returnToSnapshotButton = $('.button-cancel');
  const $textArea = $('textarea#textContent');

  function prettify() {
    const text = $textArea.val();
    const rx = /^@.*$/m;
    const separator = rx.exec(text)[0];
    let intro = text.split(separator)[0] + separator;
    let body = text.split(separator)[1];
    let footer = `SitePoint | SitePoint Premium${body.split('SitePoint | SitePoint Premium')[1]}`;

    intro = intro.replace(/View online \[webversion]\s+/, 'View Online [webversion]\n\n');

    body = body.replace(footer, '');
    body = body.replace(/]$\n(.*)/mg, ']$1');

    footer = `
SitePoint | SitePoint Premium
48 Cambridge Street
Collingwood, VIC
3066 | Australia

You're receiving this email because you signed up to receive news from SitePoint. Smart choice!

Preferences [preferences] |  Unsubscribe [unsubscribe]

Like [fblike]
Tweet [tweet]
Share [https://www.linkedin.com/shareArticle?url=[webversion]
Forward [forwardtoafriend]
    `;

    $textArea.val(intro + body + footer);
  }

  function addMakePrettyButton() {
    const $makePrettyButton = $('<button />', {
      text: 'Make Pretty',
      class: 'button primary huge',
      style: 'margin-left: 20px;',
      click(e) {
        e.preventDefault();
        prettify();
      },
    });

    $returnToSnapshotButton.append($makePrettyButton);
  }

  function init() {
    addMakePrettyButton();
  }

  return {
    init,
  };
}());

PlainTextView.init();
