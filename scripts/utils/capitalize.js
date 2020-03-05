/* exported capitalize */

const prepositions = [
  'a',
  'abaft',
  'aboard',
  'about',
  'above',
  'absent',
  'across',
  'afore',
  'after',
  'against',
  'along',
  'alongside',
  'amid',
  'amidst',
  'among',
  'amongst',
  'an',
  'apropos',
  'apud',
  'around',
  'as',
  'aside',
  'astride',
  'at',
  'athwart',
  'atop',
  'barring',
  'before',
  'behind',
  'below',
  'beneath',
  'beside',
  'besides',
  'between',
  'beyond',
  'but',
  'by',
  'circa',
  'concerning',
  'despite',
  'down',
  'during',
  'except',
  'excluding',
  'failing',
  'following',
  'for',
  'from',
  'given',
  'in',
  'including',
  'inside',
  'into',
  'lest',
  'like',
  'mid',
  'midst',
  'minus',
  'modulo',
  'near',
  'next',
  'notwithstanding',
  'of',
  'off',
  'on',
  'onto',
  'opposite',
  'out',
  'outside',
  'over',
  'pace',
  'past',
  'per',
  'plus',
  'pro',
  'qua',
  'regarding',
  'round',
  'sans',
  'since',
  'than',
  'through',
  'thru',
  'throughout',
  'thruout',
  'till',
  'times',
  'to',
  'toward',
  'towards',
  'under',
  'underneath',
  'unlike',
  'until',
  'unto',
  'up',
  'upon',
  'versus',
  'vs.',
  'vs',
  'v.',
  'v',
  'via',
  'vice',
  'with',
  'within',
  'without',
  'worth',
];

const articles = [
  'a',
  'an',
  'the',
];

const conjunctions = [
  'and',
  'but',
  'for',
  'so',
  'nor',
  'or',
  'yet',
];

function lower(word) {
  return word.toLowerCase();
}

function upper(word) {
  return word.substr(0, 1).toUpperCase() + word.substr(1);
}

const punct = "([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)";

const allLowerCase = `(${(prepositions.concat(articles).concat(conjunctions)).join('|')})`;

// Lol, WTF is going on in here??
function capitalize(title) {
  const parts = []; const split = /[:.;?!] |(?: |^)["Ò]/g;
  let index = 0;

  const newTitle = title.replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"');

  /* eslint-disable-next-line no-constant-condition */
  while (true) {
    const m = split.exec(newTitle);

    parts.push(newTitle.substring(index, m ? m.index : newTitle.length)
      .replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, (all) => (/[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all)))
      .replace(RegExp(`\\b${allLowerCase}\\b`, 'ig'), lower)
      .replace(RegExp(`^${punct}${allLowerCase}\\b`, 'ig'), (all, punctuation, word) => punctuation + upper(word))
      .replace(RegExp(`\\b${allLowerCase}${punct}$`, 'ig'), upper));

    index = split.lastIndex;

    if (m) parts.push(m[0]);
    else break;
  }

  return parts.join('').replace(/ V(s?)\. /ig, ' v$1. ')
    .replace(/(['Õ])S\b/ig, '$1s')
    .replace(/\b(AT&T|Q&A)\b/ig, (all) => all.toUpperCase());
}
