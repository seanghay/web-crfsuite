import fs from 'node:fs/promises'
import CRFSuite from '../dist/node.js'
const { Trainer, FS } = CRFSuite;

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