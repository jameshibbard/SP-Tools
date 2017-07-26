/* exported EditorToolbar */
/* global showdown, getAllHeadings, getTemplate, Handlebars, insertAt */

'use strict';

const EditorToolbar = (function EditorToolbar() {
  const $editorToolbar = $('#ed_toolbar');
  const $mainTextArea = $('#content');

  function getShowdownConverter() {
    const converter = new showdown.Converter();

    // Don't convert underscores in URLs
    // https://github.com/showdownjs/showdown/issues/96
    converter.setOption('literalMidWordUnderscores', true);
    converter.setOption('tables', true);
    return converter;
  }

  function convertToHTML(converter, md) {
    let html = converter.makeHtml(md);

    html = html.replace(/<code class="js language-js">/g, '<code class="javascript language-javascript">');
    html = html.replace(/<code class="coffee language-coffee">/g, '<code class="coffeecript language-coffeescript">');
    html = html.replace(/<code class="json language-json">/g, '<code class="javascript language-javascript">');
    html = html.replace(/<code class="html language-html">/g, '<code class="markup language-markup">');
    html = html.replace(/<code class="sh language-sh">/g, '<code class="bash language-bash">');

    return html;
  }

  function addMDButton() {
    const mdConverter = getShowdownConverter();
    const $convertButton = $('<input />', {
      type: 'button',
      value: 'MD',
      class: 'ed_button button button-small',
      id: 'bandaid-md',
      title: 'Convert MD to HTML',
      click() {
        const md = $mainTextArea.val();
        const html = convertToHTML(mdConverter, md);
        $mainTextArea.val(html);
      },
    });
    $editorToolbar.append($convertButton);
  }

  function addToCButton() {
    getTemplate('toc.hbs')
      .then((tpl) => {
        const renderToc = Handlebars.compile(tpl);

        $('<input />', {
          id: 'sp-tools-toc',
          type: 'button',
          value: 'ToC',
          class: 'ed_button button button-small',
          title: 'Insert a Table of Contents',
          click: () => {
            const html = $mainTextArea.val();
            const headings = getAllHeadings(html);
            const toc = renderToc({ headings });
            const cursorPosition = $mainTextArea.prop('selectionStart');

            $mainTextArea.val(insertAt(html, toc, cursorPosition));
          },
        })
        .appendTo($editorToolbar);
      });
  }

  return {
    init() {
      addToCButton();
      addMDButton();
    },
  };
}());
