export const SEPARATOR = '\u200b';

// list of constants needed for KCC and feature generation
// consonant and independent vowels
export const KHCONST = "កខគឃងចឆជឈញដឋឌឍណតថទធនបផពភមយរលវឝឞសហឡអឣឤឥឦឧឨឩឪឫឬឭឮឯឰឱឲឳ"
export const KHVOWEL = "឴឵ាិីឹឺុូួើឿៀេែៃោៅ\u17c6\u17c7\u17c8"

// subscript, diacritics
export const KHSUB = "្"
// MUUSIKATOAN, TRIISAP, BANTOC,ROBAT,
export const KHDIAC = "\u17c9\u17ca\u17cb\u17cc\u17cd\u17ce\u17cf\u17d0"
export const KHSYM = "៕។៛ៗ៚៙៘,.? " // add space
export const KHNUMBER = "០១២៣៤៥៦៧៨៩0123456789"  // remove 0123456789
// lunar date:  U+19E0 to U+19FF ᧠...᧿
export const KHLUNAR = "᧠᧡᧢᧣᧤᧥᧦᧧᧨᧩᧪᧫᧬᧭᧮᧯᧰᧱᧲᧳᧴᧵᧶᧷᧸᧹᧺᧻᧼᧽᧾᧿"

export const EN = "abcdefghijklmnopqrstuvwxyz0123456789"

// E=English, C=Consonant, W=wowel, N=number, O=Other, S=subcript, D=Diacritic, NS=no_space(same E)
// roll up to: NS, C, W, S, D
export const NS = "NS"