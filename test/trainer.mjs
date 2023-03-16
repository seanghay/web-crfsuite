import fs from 'node:fs/promises'
import loader from '../build/crfsuite.mjs';
const { Trainer, FS } = await loader();

let xseq = [['walk'], ['walk', 'shop'], ['clean', 'shop']]
let yseq = ['sunny', 'sunny', 'rainy']

const trainer = new Trainer();
trainer.append(xseq, yseq);
trainer.train("/model.crfsuite");
trainer.delete();

await fs.writeFile("test/model.crfsuite", Buffer.from(FS.readFile("/model.crfsuite")));