import { seg_kcc, cleanup_str } from './data.js'
import { create_kcc_features } from './features.js'

import { initialize } from 'web-crfsuite/dist/crfsuite.js'
import wasmUrl from 'web-crfsuite/dist/crfsuite.wasm?url'
import modelUrl from './khmer.crfsuite?url';

/**
 * @type {import("web-crfsuite")['default']}
 */
let CRFSuite;
/**
 * @type {import("web-crfsuite")['default']['Tagger']}
 */
let tagger;

(async function () {
  const [wasmBuffer, modelBuffer] = await Promise.all([
    fetch(wasmUrl).then(res => res.arrayBuffer()),
    fetch(modelUrl).then(res => res.arrayBuffer()),
  ]);
  CRFSuite = await initialize(wasmBuffer);
  const buffer = new Uint8Array(modelBuffer);
  CRFSuite.FS.writeFile("/model.crfsuite", buffer);
  tagger = new CRFSuite.Tagger();
  tagger.open('/model.crfsuite');
  postMessage(true);
})()


addEventListener("message", ({ data }) => {
  if (!tagger) return;

  const t = performance.now();


  const sequences = seg_kcc(cleanup_str(data))
  const xseq = create_kcc_features(sequences).map(row => {
    const entries = Object.entries(row).sort().map(([key, value]) => {
      if (key === "EOS" || key === "BOS") return null;
      if (key === "t") return null;
      if (typeof value === 'boolean') {
        value = value ? 1 : 0
      }
      return `${key}=${value}`
    }).filter(Boolean);
    if (row.BOS) entries.push('__BOS__');
    if (row.EOS) entries.push('__EOS__');
    return entries;
  });

  const yseq = tagger.tag(xseq);

  let i = 0;
  const result = [];
  const SEP = ' / ';
  for (const seq of yseq) {
    if (seq === '1' && (i !== 0)) result.push(SEP)
    result.push(sequences[i]);
    i++;
  }
  postMessage([result.join(''), performance.now() - t])
})