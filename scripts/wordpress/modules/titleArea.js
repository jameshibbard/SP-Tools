/* global Handlebars capitalize getAllMatches showModal hideModal copyTextToClipboard getTemplate */
/* exported TitleArea */

'use strict';

const TitleArea = (function TitleArea() {
  const sitePointBaseURL = 'https://www.sitepoint.com/';
  const $titleWrap = $('#titlewrap');
  const $titleInput = $('#title');
  const $editorField = $('.wp-editor-area');
  const $permalinkRow = $('#edit-slug-box').parent();
  let $scoreFrame; // $(".headalyze")
  let $scoreInfo; // $(".headalyze-info")
  let $titleCapBtn; // $("#bandaid-capitalize-and-check")
  let $scorePointer; // $(".pointer")
  let $subBtn; // $("#bandaid-capitalize-subheadings")
  let $copyLinkButton; // $("#bandaid-copy-link")
  let $rebuildLinkButton; // $("#bandaid-rebuild-link")
  let headlineAnalyzerTemplate;
  let headlineModalTemplate;

  Handlebars.registerHelper('capitalize', (text) => capitalize(text));

  // Capitalize and Check
  function getHeadlineAnalysis(headline) {
    return $.get(`https://cos-headlines.herokuapp.com/?headline=${headline}`);
  }

  function buildHeadlineAnalysisResults(data) {
    function getSentiment(sentiment) {
      return (sentiment === 'positive') ? 'positive' : 'negative';
    }

    function isPositive(val) {
      return getSentiment(val) === 'positive';
    }

    function getVal(obj, key) {
      try {
        return obj[key];
      } catch (e) {
        return undefined;
      }
    }

    function exists(val) {
      return val !== undefined;
    }

    const html = headlineAnalyzerTemplate({
      score: data.score.total,

      charCountSentiment: getSentiment(data.char_count.summary),
      charCountGood: isPositive(data.char_count.summary),
      charCountLength: data.char_count.length,
      charCountScore: data.char_count.score,
      hasCharCountSuggestions: exists(data.suggestions.char_length),
      charCountMessage: getVal(data.suggestions.char_length, 'message'),
      charCountSuggestion: getVal(data.suggestions.char_length, 'suggestion'),

      wordCountSentiment: getSentiment(data.word_count.summary),
      wordCountGood: isPositive(data.word_count.summary),
      wordCountLength: data.word_count.length,
      wordCountScore: data.word_count.score,
      hasWordCountSuggestions: exists(data.suggestions.word_count),
      wordCountMessage: getVal(data.suggestions.word_count, 'message'),
      wordCountSuggestion: getVal(data.suggestions.word_count, 'suggestion'),

      sentimentSummary: getSentiment(data.sentiment.summary),
      sentimentGood: data.sentiment.summary !== 'neutral',

      wordBalanceSentiment: getSentiment(data.word_balance.summary),
      wordBalanceGood: isPositive(data.word_balance.summary),
      commonWordsInHeadline: exists(data.suggestions.common_words),
      wordBalanceMessage: getVal(data.suggestions.common_words, 'message'),
      wordBalanceSuggestion: getVal(data.suggestions.common_words, 'suggestion'),
      wordBalancePercentage: data.word_balance.common.percentage,
      wordBalanceUncommonPercentage: data.word_balance.uncommon.percentage,
      wordBalanceEmotionalPercentage: data.word_balance.emotional.percentage,
      wordBalancePowerPercentage: data.word_balance.power.percentage,

      hasTypeSuggestions: exists(data.suggestions.type),
      typeMessage: getVal(data.suggestions.type, 'message'),
      typeSuggestion: getVal(data.suggestions.type, 'suggestion'),
    });

    return html;
  }

  // Capitalize Subheadings
  function getAllHeadings() {
    const rx = /<(h[2-6]).+>(.+)<\/\1>/ig;
    const content = $editorField.val();

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
    const matches = getAllMatches(rx, content);

    return matches;
  }

  function getFixableHeadings(headings) {
    return headings.filter(
      (heading) => heading[2] !== capitalize(heading[2]),
    ).map((heading) => heading[2]);
  }

  function buildHeadlineModal(fixable) {
    const html = headlineModalTemplate({
      somethingToOptimize: fixable.length,
      multiple: fixable.length > 1,
      fixable,
    });

    return html;
  }

  function capitalizeHeadings() {
    let content = $editorField.val();

    $(':checkbox.fixable:checked').each(function fixCheckboxes() {
      const fixable = $(this).next('.actual').text();
      const regExpString = `(<(h[2-6]).+>)${fixable}(</\\2>)`;
      const re = new RegExp(regExpString, 'g');

      content = content.replace(re, (match, p1, p2, p3) => p1 + capitalize(fixable) + p3);
    });

    $editorField.val(content);
    hideModal();
  }

  // Event handlers
  function attachEventHandlers() {
    $scoreFrame.on('click', () => $scoreInfo.toggle());

    $titleCapBtn.on('click', (e) => {
      e.preventDefault();
      const currTitle = $titleInput.val();

      if (currTitle === '') {
        showModal({
          heading: 'Nothing to Capitalize',
          bodyHTML: 'Please enter a title first!',
        });
        return;
      }

      $titleInput.val(capitalize(currTitle));

      getHeadlineAnalysis(currTitle)
        .done((data) => {
          $scorePointer.css('left', `${data.score.total}%`);
          const html = buildHeadlineAnalysisResults(data);
          $scoreInfo.html(html);
        })
        .fail(() => {
          showModal({
            heading: 'Error',
            bodyHTML: 'Could not contact API',
          });
        });
    });

    $subBtn.on('click', (e) => {
      e.preventDefault();
      const headings = getAllHeadings();
      const fixable = getFixableHeadings(headings);
      const modalContent = buildHeadlineModal(fixable);
      showModal({
        heading: 'Fixable subheadings',
        bodyHTML: modalContent,
        buttonText: 'Fix Selected',
        callback: capitalizeHeadings,
      });
    });

    $(document).on('click', '#fixable-headings-list :checkbox', function toggleChecked() {
      const $checkBoxes = $('#fixable-headings-list :checkbox');
      if (this.id === 'check-all-headings') {
        $checkBoxes.prop('checked', this.checked);
      } else {
        $('#check-all-headings').prop('checked', false);
      }
    });

    $copyLinkButton.on('click', () => {
      // Cannot be cached as hidden when page renders
      const postName = $('#editable-post-name-full').text();
      copyTextToClipboard(sitePointBaseURL + postName);
    });

    $rebuildLinkButton.on('click', () => {
      $('button.edit-slug').click();
      const title = $titleInput.val();
      $('#new-post-slug').val(title);
      $('button.save').click();
    });
  }

  function init() {
    // Get and compile templates
    // Then store in a previously eclared global
    getTemplate('headline-analyzer.hbs')
      .then((data) => { headlineAnalyzerTemplate = Handlebars.compile(data); });

    getTemplate('fixable-headings.hbs')
      .then((data) => { headlineModalTemplate = Handlebars.compile(data); });

    // Get Headalyze template and append it to title input field
    // Headalyze template adds:
    // Headalyzer score bar
    // Capitlize and Check button
    // Capitalize Subheading button
    getTemplate('headalyze.html')
      .then((html) => $titleWrap.append(html))
      .then(() => {
        $scoreFrame = $('.headalyze');
        $scoreInfo = $('.headalyze-info');
        $titleCapBtn = $('#bandaid-capitalize-and-check');
        $scorePointer = $('.pointer');
        $subBtn = $('#bandaid-capitalize-subheadings');
      })

    // Get Link Buttons template and append it to permalink row
    // Link Buttons template adds:
    // Rebuild Link button
    // Copy Link button
      .then(() => getTemplate('link-buttons.html'))
      .then((html) => $permalinkRow.append(html))
      .then(() => {
        $copyLinkButton = $('#bandaid-copy-link');
        $rebuildLinkButton = $('#bandaid-rebuild-link');
      })

    // Kick everything off
      .then(() => attachEventHandlers());
  }

  return {
    init,
  };
}());
