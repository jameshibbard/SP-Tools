"use strict";

var PlainTextView = (function() {
  var $returnToSnapshotButton = $(".button-cancel");
  var $textArea = $("textarea#textContent");

  function prettify(){
    var text = $textArea.val();

    var seperator = "[https://twitter.com/SitePointJS]";
    var intro = text.split(seperator)[0] + seperator;
    var body = text.split(seperator)[1]
    var footer = "SitePoint | SitePoint Premium" + body.split("SitePoint | SitePoint Premium")[1];

    intro = intro.replace(/View online \[webversion\]\s+/, 'View Online [webversion]\n\n');
    intro = intro.replace(/\n(.*?)JavaScript Channel(.*?)/m, '$1JavaScript Channel$2\n')
    intro = intro.replace(/\n\n@SitePointJS \[https:\/\/twitter.com\/SitePointJS\]/m, '@SitePointJS [https://twitter.com/SitePointJS]\n')

    body = body.replace(footer, '');
    body = body.replace(/\]$\n(.*)/mg, "]$1")

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
    `

    $textArea.val(intro + body + footer);
  }

  function addMakePrettyButton(){
    var $makePrettyButton = $("<button />", {
      text: "Make Pretty",
      class: "button primary huge",
      style: "margin-left: 20px;",
      click: function(e){
        e.preventDefault();
        prettify();
      }
    });

    $returnToSnapshotButton.append($makePrettyButton);
  }

  function init(){
    addMakePrettyButton();
  }

  return {
    init: init
  };
})();

PlainTextView.init();
