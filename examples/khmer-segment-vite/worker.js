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



function create_graphemes(text) {

  const regex = /([\u1780-\u17df]+)|([\u17e0-\u17e9]+)|(\s+)|([^\u1780-\u17ff\s]+)/gm

  const chunks = [];
  let result;

  while (result = regex.exec(text)) {

    // anything else
    if (result[4]) {
      chunks.push([result[4], 'NS'])
      continue
    }

    // whitespaces
    if (result[3]) {
      chunks.push([result[3], 'NS'])
      continue
    }

    // numbers
    if (result[2]) {
      chunks.push([result[2], 'NS'])
      continue
    }

    // khmer characters
    if (result[1]) {

      const grapheme_regex = /([\u1780-\u17FF](\u17d2[\u1780-\u17FF]|[\u17B6-\u17D1\u17D3\u17DD])*)/gm
      let grapheme_result;

      while (grapheme_result = grapheme_regex.exec(result[1])) {
        const value = grapheme_result[0]
        const type = value.length === 1 ? 'C' : `K${value.length}`
        chunks.push([value, type])
      }

      continue
    }
  }

  return chunks
}

function create_features(graphemes) {

  const chunks = []
  const size = graphemes.length
  const kccs = graphemes;

  for (let i = 0; i < size; i++) {

    const items = [
      `kcc:${kccs[i][0]}`,
      '1.0',
      `t:${kccs[i][1]}`,
      '1.0',
      `ns`,
      kccs[i][1] === "NS" ? `1.0` : `0.0`
    ]

    chunks.push(items)

    if (i == 0) {
      items.push(`BOS`)
      items.push(`1.0`)
    }


    if (i >= 1) {
      items.push(`kcc[-1]:${kccs[i - 1][0]}`)
      items.push('1.0')

      items.push(`kcc[-1]t:${kccs[i - 1][1]}`)
      items.push('1.0')

      items.push(`kcc[-1:0]:${kccs[i - 1][0] + kccs[i][0]}`)
      items.push('1.0')

      items.push(`ns-1`)
      items.push(kccs[i - 1][1] === "NS" ? "1.0" : "0.0")
    }


    if (i >= 2) {
      items.push(`kcc[-2]:${kccs[i - 2][0]}`)
      items.push('1.0')

      items.push(`kcc[-2]t:${kccs[i - 2][1]}`)
      items.push('1.0')

      items.push(`kcc[-2:-1]:${kccs[i - 2][0] + kccs[i - 1][0]}`)
      items.push('1.0')

      items.push(`kcc[-2:0]:${kccs[i - 2][0] + kccs[i - 1][0] + kccs[i][0]}`)
      items.push('1.0')
    }

    if (i >= 3) {

      items.push(`kcc[-3]:${kccs[i - 3][0]}`)
      items.push('1.0')

      items.push(`kcc[-3]t:${kccs[i - 3][1]}`)
      items.push('1.0')

      items.push(`kcc[-3:0]:${kccs[i - 3][0] + kccs[i - 2][0] + kccs[i - 1][0] + kccs[i][0]}`)
      items.push('1.0')

      items.push(`kcc[-3:-1]:${kccs[i - 3][0] + kccs[i - 2][0] + kccs[i - 1][0]}`)
      items.push('1.0')

      items.push(`kcc[-3:-2]:${kccs[i - 3][0] + kccs[i - 2][0]}`)
      items.push('1.0')

    }


    if (i < size - 1) {
      items.push(`kcc[+1]:${kccs[i + 1][0]}`)
      items.push('1.0')

      items.push(`kcc[+1]t:${kccs[i + 1][1]}`)
      items.push('1.0')

      items.push(`kcc[+1:0]:${kccs[i][0] + kccs[i + 1][0]}`)
      items.push('1.0')

      items.push(`ns+1`)
      items.push(kccs[i + 1][1] === 'NS' ? '1.0': '0.0')
    }

    if (i < size - 2) {
      items.push(`kcc[+2]:${kccs[i + 2][0]}`)
      items.push('1.0')

      items.push(`kcc[+2]t:${kccs[i + 2][1]}`)
      items.push('1.0')

      items.push(`kcc[+1:+2]:${kccs[i + 1][0] + kccs[i + 2][0]}`)
      items.push('1.0')

      items.push(`kcc[0:+2]:${kccs[i][0]  + kccs[i + 1][0] + kccs[i + 2][0]}`)
      items.push('1.0')

      items.push(`ns+2`)
      items.push(kccs[i + 2][1] === 'NS' ? '1.0': '0.0')
    }

    if (i < size - 3) {
      items.push(`kcc[+3]:${kccs[i + 3][0]}`)
      items.push('1.0')

      items.push(`kcc[+3]t:${kccs[i + 3][1]}`)
      items.push('1.0')

      items.push(`kcc[+2:+3]:${kccs[i + 2][0] + kccs[i + 3][0]}`)
      items.push('1.0')

      items.push(`kcc[+1:+3]:${kccs[i + 1][0] + kccs[i + 2][0] + kccs[i + 3][0]}`)
      items.push('1.0')

      items.push(`kcc[0:+3]:${kccs[i][0]  + kccs[i + 1][0] + kccs[i + 2][0] + kccs[i + 3][0]}`)
      items.push('1.0')
    }

    if (i == size - 1) {
      items.push(`EOS`)
      items.push(`1.0`)
    }

  }

  return chunks
}

addEventListener("message", ({ data }) => {
  if (!tagger) return;

  const t = performance.now();
	data = data.replace(/\u200b/gm, '');
	const chunks = create_graphemes(data)
	const xseq = create_features(chunks)
	const preds = tagger.tag(xseq);
	const tokens = []

	for (let i = 0; i < preds.length; i++) {
		if (preds[i] == '1' || i == 0) {
			tokens.push(chunks[i][0])
		} else {
			tokens[tokens.length - 1] += chunks[i][0]
		}
	}

	console.log(tokens)
  postMessage([JSON.stringify(tokens), performance.now() - t])
})