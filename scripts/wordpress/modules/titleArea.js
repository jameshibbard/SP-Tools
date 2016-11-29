"use strict";

var TitleArea = (function() {
  const sitePointBaseURL = "https://www.sitepoint.com/";
  var $titleWrap = $("#titlewrap");
  var $titleInput = $("#title");
  var $editorField = $(".wp-editor-area");
  var $permalinkRow = $('#edit-slug-box').parent();
  var $scoreFrame; // $(".headalyze")
  var $scoreInfo; // $(".headalyze-info")
  var $titleCapBtn; // $("#bandaid-capitalize-and-check")
  var $scorePointer; // $(".pointer")
  var $subBtn; // $("#bandaid-capitalize-subheadings")
  var $copyLinkButton; // $("#bandaid-copy-link")
  var $rebuildLinkButton; // $("#bandaid-rebuild-link")
  var headlineAnalyzerTemplate;
  var headlineModalTemplate;

  Handlebars.registerHelper('capitalize', function(text) {
    return capitalize(text);
  });

  // Capitalize and Check
  function getHeadlineAnalysis(headline){
    return $.get("https://cos-headlines.herokuapp.com/?headline=" + headline);
  }

  function buildHeadlineAnalysisResults(data){
    function getSentiment(sentiment){
      return (sentiment === "positive")? "positive" : "negative";
    }

    function isPositive(val){
      return getSentiment(val) === "positive";
    }

    function getVal(obj, key){
      try {
        return obj[key];
      } catch(e) {
        return undefined;
      }
    }

    function exists(val){
      return val !== undefined;
    }

    var html = headlineAnalyzerTemplate({
      score: data.score.total,

      charCountSentiment: getSentiment(data.char_count.summary),
      charCountGood: isPositive(data.char_count.summary),
      charCountLength: data.char_count.length,
      charCountScore: data.char_count.score,
      hasCharCountSuggestions: exists(data.suggestions.char_length),
      charCountMessage: getVal(data.suggestions.char_length, "message"),
      charCountSuggestion: getVal(data.suggestions.char_length, "suggestion"),

      wordCountSentiment: getSentiment(data.word_count.summary),
      wordCountGood: isPositive(data.word_count.summary),
      wordCountLength: data.word_count.length,
      wordCountScore: data.word_count.score,
      hasWordCountSuggestions: exists(data.suggestions.word_count),
      wordCountMessage: getVal(data.suggestions.word_count, "message"),
      wordCountSuggestion: getVal(data.suggestions.word_count, "suggestion"),

      sentimentSummary: getSentiment(data.sentiment.summary),
      sentimentGood: data.sentiment.summary !== "neutral",

      wordBalanceSentiment: getSentiment(data.word_balance.summary),
      wordBalanceGood: isPositive(data.word_balance.summary),
      commonWordsInHeadline: exists(data.suggestions.common_words),
      wordBalanceMessage: getVal(data.suggestions.common_words, "message"),
      wordBalanceSuggestion:getVal(data.suggestions.common_words, "suggestion"),
      wordBalancePercentage: data.word_balance.common.percentage,
      wordBalanceUncommonPercentage: data.word_balance.uncommon.percentage,
      wordBalanceEmotionalPercentage: data.word_balance.emotional.percentage,
      wordBalancePowerPercentage: data.word_balance.power.percentage,

      hasTypeSuggestions: exists(data.suggestions.type),
      typeMessage: getVal(data.suggestions.type, "message"),
      typeSuggestion: getVal(data.suggestions.type, "suggestion"),
    });

    return html;
  }

  // Capitalize Subheadings
  function getAllHeadings(){
    var rx = /<(h[2-6]).+>(.+)<\/\1>/ig;
    var content = $editorField.val();

    // getAllMatches returns an array of arrays
    // [Array[3], Array[3]]

    // Each fixable heading is in its own array
    // 0: Array[3]
    //   0: "<h2 id="hellotheretoday">hello there today</h2>"
    //   1: "h2"
    //   2: "hello there today"
    //   index: 0
    //   input: "<h2 id="hellotheretoday">hello there today</h2>↵<h2 id="hellotheretoday">hello there todayyy</h2>"
    //   length:3
    var matches = getAllMatches(rx, content);

    return matches;
  }

  function getFixableHeadings(headings){
    return headings.filter(
      heading => heading[2] !== capitalize(heading[2])
    ).map( heading => heading[2] );
  }

  function buildHeadlineModal(fixable){
    var html = headlineModalTemplate({
      somethingToOptimize: fixable.length,
      multiple: fixable.length > 1,
      fixable: fixable
    });

    return html;
  }

  function capitalizeHeadings(){
    var content = $editorField.val();

    $(":checkbox.fixable:checked").each(function(){
      var fixable = $(this).next(".actual").text();
      var regExpString = "(<(h[2-6]).+>)" + fixable + "(</\\2>)";
      var re = new RegExp(regExpString, "g");

      content = content.replace(re, function(match, p1, p2, p3) {
        return p1 + capitalize(fixable) + p3;
      });
    });

    $editorField.val(content);
    hideModal();
  }

  // Event handlers
  function attachEventHandlers(){
    $scoreFrame.on("click", () => $scoreInfo.toggle());

    $titleCapBtn.on("click", function(e){
      e.preventDefault();
      var currTitle = $titleInput.val();

      if(currTitle === ""){
        showModal({
          heading: "Nothing to Capitalize",
          bodyHTML: "Please enter a title first!"
         });
        return;
      }

      $titleInput.val(capitalize(currTitle));

      getHeadlineAnalysis(currTitle)
      .done(function(data){
        $scorePointer.css("left", data.score.total + "%");
        var html = buildHeadlineAnalysisResults(data);
        $scoreInfo.html(html);
      })
      .fail(function(){
        showModal({
          heading: "Error",
          bodyHTML: "Could not contact API",
         });
      });
    });

    $subBtn.on("click", function(e) {
      e.preventDefault();
      var headings = getAllHeadings();
      var fixable = getFixableHeadings(headings);
      var modalContent = buildHeadlineModal(fixable);
      showModal({
        heading: "Fixable subheadings",
        bodyHTML: modalContent,
        buttonText: "Fix Selected",
        callback: capitalizeHeadings
      });
    });

    $(document).on("click", "#fixable-headings-list :checkbox", function(){
      var $checkBoxes = $("#fixable-headings-list :checkbox");
      if(this.id === "check-all-headings"){
        $checkBoxes.prop('checked', this.checked);
      } else {
        $("#check-all-headings").prop('checked', false);
      }
    });

    $copyLinkButton.on("click", function(){
      // Cannot be cached as hidden when page renders
      var postName = $("#editable-post-name-full").text();
      copyTextToClipboard(sitePointBaseURL + postName);
    });

    $rebuildLinkButton.on("click", function(){
      $("button.edit-slug").click();
      var title = $titleInput.val();
      $("#new-post-slug").val(title);
      $("button.save").click();
    });
  }

  function init(){
    // Get and compile templates
    // Then store in a previously eclared global
    getTemplate("headline-analyzer.hbs")
    .then((data) => headlineAnalyzerTemplate = Handlebars.compile(data));

    getTemplate("fixable-headings.hbs")
    .then((data) => headlineModalTemplate = Handlebars.compile(data));

    // Get Headalyze template and append it to title input field
    // Headalyze template adds:
    // Headalyzer score bar
    // Capitlize and Check button
    // Capitalize Subheading button
    getTemplate("headalyze.html")
    .then((html) => $titleWrap.append(html))
    .then(function(){
      $scoreFrame = $(".headalyze");
      $scoreInfo = $(".headalyze-info");
      $titleCapBtn = $("#bandaid-capitalize-and-check");
      $scorePointer = $(".pointer");
      $subBtn = $("#bandaid-capitalize-subheadings");
    })

    // Get Link Buttons template and append it to permalink row
    // Link Buttons template adds:
    // Rebuild Link button
    // Copy Link button
    .then(() => getTemplate("link-buttons.html"))
    .then((html) => $permalinkRow.append(html))
    .then(function(){
      $copyLinkButton = $("#bandaid-copy-link");
      $rebuildLinkButton = $("#bandaid-rebuild-link");
    })

    // Kick everything off
    .then(() => attachEventHandlers());
  }

  return {
    init: init
  };
})();
