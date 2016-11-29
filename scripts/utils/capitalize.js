
var prepositions = [
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
    'vs\.',
    'vs',
    'v\.',
    'v',
    'via',
    'vice',
    'with',
    'within',
    'without',
    'worth'
];
var articles = [
    'a',
    'an',
    'the'
];
var conjunctions = [
    'and',
    'but',
    'for',
    'so',
    'nor',
    'or',
    'yet'
];
var punct = "([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)";

var all_lower_case = '(' + (prepositions.concat(articles).concat(conjunctions)).join('|') + ')';

var capitalize = function (title) {
    var parts = [], split = /[:.;?!] |(?: |^)["Ò]/g, index = 0;

    title = title.replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"');

    while (true) {
        var m = split.exec(title);

        parts.push(title.substring(index, m ? m.index : title.length)
            .replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, function (all) {
                return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all);
            })
            .replace(RegExp("\\b" + all_lower_case + "\\b", "ig"), lower)
            .replace(RegExp("^" + punct + all_lower_case + "\\b", "ig"), function (all, punct, word) {
                return punct + upper(word);
            })
            .replace(RegExp("\\b" + all_lower_case + punct + "$", "ig"), upper));

        index = split.lastIndex;

        if (m) parts.push(m[0]);
        else break;
    }

    return parts.join("").replace(/ V(s?)\. /ig, " v$1. ")
        .replace(/(['Õ])S\b/ig, "$1s")
        .replace(/\b(AT&T|Q&A)\b/ig, function (all) {
            return all.toUpperCase();
        });
};

function lower(word) {
    return word.toLowerCase();
}

function upper(word) {
    return word.substr(0, 1).toUpperCase() + word.substr(1);
}