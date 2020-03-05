/* exported showModal */
/* global getTemplate Handlebars */

function hideModal() {
  $('#bandaid-overlay').remove();
  $('#bandaid-modal').remove();
}

function showModal(opts) {
  const callback = opts.callback || $.noop();
  const buttonText = opts.buttonText || '';

  function attachEventHandlers() {
    $('#bandaid-modal-close, #bandaid-overlay').on('click', () => {
      hideModal();
    });

    $('.actbutton button').on('click', callback);
  }

  let modalTemplate;

  getTemplate('modal.hbs')
    .then((data) => {
      modalTemplate = Handlebars.compile(data);
      const html = modalTemplate({
        modalHeading: opts.heading,
        bodyHTML: opts.bodyHTML,
        hasButton: 'buttonText' in opts,
        buttonText,
      });
      $('#wpwrap').append(html);
      attachEventHandlers();
    });
}
