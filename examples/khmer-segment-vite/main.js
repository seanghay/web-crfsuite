import './main.css'
import CRFSuiteWorker from "./worker?worker";
import prettyMilliseconds from 'pretty-ms';

const worker = new CRFSuiteWorker();
const $text = document.querySelector('#text');
const $textResult = document.querySelector('#text_result')
const $speed = document.querySelector("#speed");

$text.value = 'មិនដឹងទេនេះគ្រាន់តែជាការ Demo';

worker.onmessage = msg => {

  if (msg.data === true) {
    document.body.classList.add('ready')
    worker.postMessage($text.value);
    return;
  }

  $textResult.value = msg.data[0];
  const elapsed = msg.data[1];
  $speed.innerHTML = `(${prettyMilliseconds(elapsed)})`;
}

$text.addEventListener('input', e => worker.postMessage(e.target.value))
