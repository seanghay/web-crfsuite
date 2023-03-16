import fs from 'node:fs/promises'
import loader from '../build/crfsuite.mjs';
const { Trainer, FS } = await loader();

let xseq = [['walk'], ['walk', 'shop'], ['clean', 'shop']]
let yseq = ['sunny', 'sunny', 'rainy']

const trainer = new Trainer();

trainer.setParamsObject({
  period: '10'
})

console.log(trainer.getParamsObject());
trainer.set('period', '10')

console.log(trainer.get('period'))

trainer.append(xseq, yseq);
trainer.train("/model.crfsuite");
trainer.delete();

await fs.writeFile("test/model.crfsuite", Buffer.from(FS.readFile("/model.crfsuite")));