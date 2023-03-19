import * as constants from './constants.js'


/**
 * @param {string} char 
 * @returns {string}
 */
export function get_type(char) {
  char = char.toLowerCase()
  if (constants.EN.includes(char)) return constants.NS
  if (constants.KHCONST.includes(char)) return "C"
  if (constants.KHVOWEL.includes(char)) return "W"
  if (constants.KHNUMBER.includes(char)) return constants.NS // remove?
  if (constants.KHSUB.includes(char)) return "S"
  if (constants.KHDIAC.includes(char)) return "D"
  return constants.NS
}

/**
 * @param {any[]} k 
 */
export function is_no_space(k) {
  return (get_type(k[0]) === constants.NS)
}

/**
 * @param {string} k 
 * @returns 
 */
export function kcc_type(k) {
  if (k.length === 1) return get_type(k);
  return "K" + k.length;
}

/**
 * @param {string[]} kccs 
 * @param {number} i 
 */
export function kcc_to_features(kccs, i) {
  const maxi = kccs.length;
  const kcc = kccs[i];

  let features = {
    kcc: kcc,
    t: kcc_type(kcc),
    ns: is_no_space(kcc)
  }

  if (i >= 1) {
    features = {
      ...features,
      "kcc[-1]": kccs[i - 1],
      "kcc[-1]t": kcc_type(kccs[i - 1]),
      "kcc[-1:0]": kccs[i - 1] + kccs[i],
      "ns-1": is_no_space(kccs[i - 1]),
    }
  } else {
    features = {
      ...features,
      BOS: true,
    }
  }


  if (i >= 2) {
    features = {
      ...features,
      "kcc[-2]": kccs[i - 2],
      "kcc[-2]t": kcc_type(kccs[i - 2]),
      "kcc[-2:-1]": kccs[i - 2] + kccs[i - 1],
      "kcc[-2:0]": kccs[i - 2] + kccs[i - 1] + kccs[i],
    }
  }

  if (i >= 3) {
    features = {
      ...features,
      "kcc[-3]": kccs[i - 3],
      "kcc[-3]t": kcc_type(kccs[i - 3]),
      "kcc[-3:0]": kccs[i - 3] + kccs[i - 2] + kccs[i - 1] + kccs[i],
      "kcc[-3:-1]": kccs[i - 3] + kccs[i - 2] + kccs[i - 1],
      "kcc[-3:-2]": kccs[i - 3] + kccs[i - 2],
    }
  }

  if (i < maxi - 1) {
    features = {
      ...features,
      "kcc[+1]": kccs[i + 1],
      "kcc[+1]t": kcc_type(kccs[i + 1]),
      "kcc[+1:0]": kccs[i] + kccs[i + 1],
      "ns+1": is_no_space(kccs[i + 1]),
    }
  } else {
    features = {
      ...features,
      EOS: true,
    }
  }

  if (i < maxi - 2) {
    features = {
      ...features,
      "kcc[+2]": kccs[i + 2],
      "kcc[+2]t": kcc_type(kccs[i + 2]),
      "kcc[+1:+2]": kccs[i + 1] + kccs[i + 2],
      "kcc[0:+2]": kccs[i + 0] + kccs[i + 1] + kccs[i + 2],
      "ns+2": is_no_space(kccs[i + 2]),
    }
  }

  if (i < maxi - 3) {
    features = {
      ...features,
      "kcc[+3]": kccs[i + 3],
      "kcc[+3]t": kcc_type(kccs[i + 3]),
      "kcc[+2:+3]": kccs[i + 2] + kccs[i + 3],
      "kcc[+1:+3]": kccs[i + 1] + kccs[i + 2] + kccs[i + 3],
      "kcc[0:+3]": kccs[i + 0] + kccs[i + 1] + kccs[i + 2] + kccs[i + 3],
    }
  }

  return features;
}



/**
 * @param {string[]} kccs  
 */
export function create_kcc_features(kccs) {
  const features = [];
  for (let i = 0; i < kccs.length; i++) {
    features.push(kcc_to_features(kccs, i))
  }
  return features;
}