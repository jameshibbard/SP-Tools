/* exported authorMoreValidator, relativeLinkValidator, h1Validator */
/* global getAllMatches, linkOk */

function authorMoreValidator(page) {
  const content = page.editor.value;

  if (content.indexOf('[author_more]') === -1) {
    return {
      isValid: false,
      message: 'Missing [author_more] shortcode',
    };
  }

  return { isValid: true };
}

function relativeLinkValidator(page) {
  const rx = /<a\s+(?:[^>]*?\s+)?href=(['"])([^"]*)\1/ig;
  const matches = getAllMatches(rx, page.editor.value);

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

function h1Validator(page) {
  const rx = /<h1.*?>.*?<\/h1>/ig;
  const matches = getAllMatches(rx, page.editor.value);

  if (matches.length === 0) {
    return { isValid: true };
  }

  return {
    isValid: false,
    message: 'H1 tag found!',
  };
}
