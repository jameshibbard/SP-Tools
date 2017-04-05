chrome.extension.sendMessage({}, function (response) {
  var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
      // This part of the script triggers when page is done loading

      // Editor bar
      // Adds button to convert MD -> HTML
      EditorToolbar.init();

      // Title area
      // Adds "Capitalize and check" button
      // Adds "Capitalize subheadings" button
      // Adds headline analyzer
      // Adds "Copy link" and "Rebuild link" buttons
      TitleArea.init();

      // Editor pane
      // Adds status bar
      // Checks for presence of [author_more] tag
      // Checks for relative links
      EditorPane.init();

      // Publish widget
      // Show warning when article is saved/scheduled with dodgy looking slug
      // Replace schedule field with date picker
      PublishWidget.init();

      // Tags widget
      // Adds "Toggle categories" button
      CategoriesWidget.init();

      // Tags widget
      // Adds "Copy tags" button
      TagsWidget.init();

      // Series Widget
      // Adds filter functionality to series widget
      SeriesWidget.init();

      // Syntax Highlighting widget
      // Syntax highlighting defaults to primary category
      // Corrects bug in custom fields implementation
      SyntaxHighlightingWidget.init();

      // Generic changes applied to whole page
      // Hides unnecessary elements
      PostPage.init();
    }
  }, 10);
});
