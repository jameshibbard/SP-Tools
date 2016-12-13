/* exported authorMoreValidator, relativeLinkValidator */
/* global getAllMatches, linkOk */

function authorMoreValidator(page) {
  if (page.editorContents.indexOf('[author_more]') === -1) {
    return {
      isValid: false,
      message: 'Missing [author_more] shortcode',
    };
  }

  return { isValid: true };
}

function relativeLinkValidator(page) {
  const rx = /<a\s+(?:[^>]*?\s+)?href=(['"])([^"]*)\1/ig;
  const matches = getAllMatches(rx, page.editorContents);

  const relativeSlugs = [];
  matches.forEach((el) => {
    if (!linkOk(el[2])) {
      relativeSlugs.push(el[2]);
    }
  });

  if (relativeSlugs.length === 0) {
    return { isValid: true };
  }

  return {
    isValid: false,
    message: `Relative link found: ${relativeSlugs.join(', ')}`,
  };
}
