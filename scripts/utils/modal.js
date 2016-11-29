function showModal(opts){
  var callback = opts.callback || $.noop();
  var buttonText = opts.buttonText || "";

  function attachEventHandlers(){
    $("#bandaid-modal-close, #bandaid-overlay").on("click", function(){
      hideModal();
    });

    $(".actbutton button").on("click", callback);
  }

  var $wrap = $("#wpwrap");
  var modalTemplate;

  getTemplate("modal.hbs")
  .then(function(data){
    modalTemplate = Handlebars.compile(data);
    var html = modalTemplate({
      modalHeading: opts.heading,
      bodyHTML: opts.bodyHTML,
      hasButton: "buttonText" in opts,
      buttonText: opts.buttonText
    });
    $("#wpwrap").append(html);
    attachEventHandlers();
  });
}

function hideModal(){
  $("#bandaid-overlay").remove();
  $("#bandaid-modal").remove();
}
