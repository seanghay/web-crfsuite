import fs from 'node:fs/promises'
import loader from '../build/crfsuite.mjs';
const { Tagger, FS } = await loader();

const buffer = await fs.readFile("test/model.crfsuite");
FS.writeFile("/model", buffer);
const tagger = new Tagger();
tagger.open("/model");
const xseq = [['walk', 'shop'], ['clean', 'shop']]
const result = tagger.tag(xseq);
tagger.close();
tagger.delete();

console.log(result)
