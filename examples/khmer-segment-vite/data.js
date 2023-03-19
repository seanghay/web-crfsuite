import { KHSUB, KHSYM, KHLUNAR, KHCONST, KHNUMBER, SEPARATOR } from './constants.js'

/**
 * 
 * @param {string} text 
 */
export function cleanup_str(text) {
  text = text.trim();
  text = text.replace(/^[\u200b]+/gm, '');
  text = text.replace(/[\u200b]+$/gm, '');
  text = text.replace(/\s\s+/g, ' ');
  text = text.replace(/\s/g, '\u200b \u200b');
  text = text.replace(/[\u200b]+/g, '\u200b');
  text = text.replace(/\u2028/g, "")
  text = text.replace(/\u200a/g, "")
  text = text.replace(/\n/g, "")
  return text;
}

/**
 * @param {string} ch 
 */
export function is_khmer_char(ch) {
  if (/[\u1780-\u17FF]/.test(ch)) return true;
  if (KHSYM.includes(ch)) return true;
  if (KHLUNAR.includes(ch)) return true;
  return false;
}

/**
 * @param {string} ch 
 */
export function is_start_of_kcc(ch) {
  if (is_khmer_char(ch)) {
    if (KHCONST.includes(ch)) return true;
    if (KHSYM.includes(ch)) return true
    if (KHNUMBER.includes(ch)) return true;
    if (KHLUNAR.includes(ch)) return true;
    return false;
  }
  return true;
}

/**
 * @param {string} str_sentence 
 */
export function seg_kcc(str_sentence) {
  const segs = [];

  let nextchar;
  let cur = ""
  let sentence = str_sentence;

  for (const word of sentence.split(SEPARATOR)) {
    for (let i = 0; i < word.length; i++) {
      const c = word[i];
      cur += c
      nextchar = (i + 1 < word.length) ? word[i + 1] : ""

      // cluster non-khmer chars together
      if (!is_khmer_char(c) && nextchar != " " && nextchar != "" && !is_khmer_char(nextchar)) {
        continue;
      }

      // cluster number together
      if (KHNUMBER.includes(c) && KHNUMBER.includes(nextchar)) {
        continue;
      }

      // cluster non-khmer together
      // non-khmer character has no cluster
      if (!is_khmer_char(c) || nextchar == " " || nextchar == "") {
        segs.push(cur);
        cur = "";
      } else if (is_start_of_kcc(nextchar) && !(KHSUB.includes(c))) {
        segs.push(cur);
        cur = "";
      }
    }
  }

  return segs
}
