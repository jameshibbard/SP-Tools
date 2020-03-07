/* global TagsWidget EditorToolbar TitleArea EditorPane PublishWidget CategoriesWidget */

// The WP content script should only run on the new post page and the edit post page
// https://www.sitepoint.com/wp-admin/post-new.php
// https://www.sitepoint.com/wp-admin/post.php?post=<id>&action=edit
// In the manifest, the match pattern is specified as: https://www.sitepoint.com/wp-admin/post*
// Unfortunately, the content script is also running on pages it shouldn't.
// For example the edit media page, or the Sass Reference, both of which have the following URL structure
// https://www.sitepoint.com/wp-admin/post.php?post=<id>&action=edit
// Therefore I threw this `shouldRun` function in here which determines the page we're on based on the menu
// It's a bit hacky, as ideally each component should work out if it needs to initialize itself or not
// But for the time being, it'll do
function shouldRun() {
  const menu = document.querySelector('ul#adminmenu > li.wp-has-current-submenu > ul');
  if (!menu) return false;

  const menuItem = menu.querySelector('li.wp-submenu-head').textContent;
  if (menuItem !== 'Posts') return false;

  const subMenuItem = menu.querySelector('li.current').textContent;
  if (subMenuItem !== 'All Posts' && subMenuItem !== 'Add New') return false;

  return true;
}

if (shouldRun()) {
  // Editor bar
  // Adds button to convert MD -> HTML
  // Adds button to toggle rel="sponsored"
  EditorToolbar.init();

  // Title area
  // Adds "Capitalize and check" button
  // Adds "Capitalize subheadings" button
  // Adds headline analyzer
  // Adds "Copy link" and "Rebuild link" buttons
  TitleArea.init();

  // Editor pane
  // Adds status bar
  // Adds molly-guard
  EditorPane.init();

  // Publish widget
  // Replace schedule field with date picker
  PublishWidget.init();

  // Tags widget
  // Adds "Toggle categories" button
  CategoriesWidget.init();

  // Tags widget
  // Adds "Copy tags" button
  TagsWidget.init();
}
