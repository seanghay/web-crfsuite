import fs from 'node:fs/promises'
import CRFSuite from '../dist/node.js'
const { Tagger, FS } = CRFSuite;

const buffer = await fs.readFile("test/model.crfsuite");
FS.writeFile("/model", buffer);
const tagger = new Tagger();
tagger.open("/model");
console.log(tagger.labels())
const xseq = [['walk'], ['walk', 'shop'], ['clean', 'shop']];

const result = tagger.tag(xseq);
tagger.close();
tagger.delete();

console.log(result);