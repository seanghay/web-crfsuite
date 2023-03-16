import { initialize } from 'web-crfsuite/dist/crfsuite.js'
import wasmUrl from 'web-crfsuite/dist/crfsuite.wasm?url'
import { saveAs } from 'file-saver';
import './main.css'


(async function () {
  const jsonEl = document.querySelector("#json")
  const downloadEl = document.querySelector("#download")

  const res = await fetch(wasmUrl);
  const buffer = await res.arrayBuffer();

  /**
   * @type {import("web-crfsuite")['default']}
   */
  const { Tagger, Trainer, FS } = await initialize(buffer);


  const xseq = [['walk'], ['walk', 'shop'], ['clean', 'shop']]
  const yseq = ['sunny', 'sunny', 'rainy']
  const trainer = new Trainer();
  trainer.append(xseq, yseq);
  trainer.train("/model.crfsuite");
  downloadEl.disabled = false;

  // output model buffer
  const modelData = FS.readFile("/model.crfsuite");
  // save model

  downloadEl.addEventListener('click', () => {
    const blob = new Blob([modelData], { type: "octet/stream" });
    saveAs(blob, "model.crfsuite")
  })

  const tagger = new Tagger()
  tagger.open("/model.crfsuite");
  const prediction = tagger.tag(xseq);

  jsonEl.innerHTML = JSON.stringify({
    xseq,
    yseq,
    trainer: {
      ...trainer.getParamsObject(),
    },
    tagger: {
      labels: tagger.labels(),
      prediction
    }
  }, null, 2);

  // clean up
  tagger.close();
  tagger.delete();
  trainer.delete();
})()
