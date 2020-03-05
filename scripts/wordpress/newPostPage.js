/* global TagsWidget EditorToolbar TitleArea EditorPane PublishWidget CategoriesWidget PostPage */

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
