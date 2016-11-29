"use strict";

var EditView = (function() {
  var $editorPane = $("#editorPane");
  var $editorPaneBottomToolBar = $("#editorPane .overview .buttons");
  var $mdtohtml; // $("#md-to-html")
  var converter = getShowdownConverter();

  function getShowdownConverter(){
    var converter = new showdown.Converter();

    // Don't convert underscores in URLs
    // https://github.com/showdownjs/showdown/issues/96
    converter.setOption('literalMidWordUnderscores', true);
    converter.setOption('tables', true);
    return converter;
  }

  function convertToHTML(converter, md){
    var html = converter.makeHtml(md);

    // Custom shit
    html = html.replace(/<blockquote>\s+?<p>/gm, '<p style="border-left: 10px solid rgba(128,128,128,0.075); background-color: rgba(128,128,128,0.05); padding: 15px 20px;">');
    html = html.replace(/<\/blockquote>/gm, '');

    return html;
  }

  function addMDButton(){
    var $convertButton = $("<button />", {
      text: "MD > HTML",
      id: "md-to-html",
      style: "float: left; margin-left: 10px; display: none;",
      click: function(){
        var md = $("textarea.cke_source").val();
        var html = convertToHTML(converter, md);
        $("textarea.cke_source").val(html);
      }
    });
    $editorPaneBottomToolBar.append($convertButton);
    $mdtohtml = $("#md-to-html");
  }

  function attachEventHandlers(){
    $editorPane.on("click", "a[title='Source']", function(){
      $mdtohtml.toggle();
      $("textarea.cke_source").css("resize", "vertical");
    });
  }

  function attachMutationObserver(){
    // Mutation observer to watch for changes to editor pane
    // Pressing (for example) "Edit" in the preview pane
    // Will swap out the ck instance, but leave the MD > HTML button visible
    //
    var observer = new MutationObserver(function() {
      if($(".cke_button_source").hasClass("cke_off")){
        $mdtohtml.hide();
      }
    });

    observer.observe(
      $editorPane.get(0),
      { attributes: true }
    );
  }

  function init(){
    addMDButton();
    attachEventHandlers();
    attachMutationObserver();
  }

  return {
    init: init
  };
})();

EditView.init();
