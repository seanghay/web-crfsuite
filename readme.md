# web-crfsuite

A port of [crfsuite](https://github.com/chokkan/crfsuite) for Node, Browser & Deno

## Usage

```js
import CRFSuite from "web-crfsuite";

// training example
const trainer = new CRFSuite.Trainer();
const xseq = [['walk'], ['walk', 'shop'], ['clean', 'shop']];
const yseq = ['sunny', 'sunny', 'rainy'];

trainer.append(xseq, yseq);

// virtual file system
trainer.train("/model.crfsuite");

const buffer = FS.readFile("/model.crfsuite");

// tagging example
const tagger = new CRFSuite.Trainer();

// writing to the virtual file system
FS.writeFile("/model.crfsuite", buffer);

const result = tagger.tag(xseq);
// => [ 'sunny', 'sunny', 'rainy' ]
```

## Building

Make sure you've [Emscripten](https://emscripten.org/) sdk install on your environment.

1. Clone the project

```
git clone --recursive https://git@github.com:seanghay/web-crfsuite.git
```

2. Compile & Build

```
npm install
npm run build
```

It will create a folder called `build` in the current directory with the output files.

## References

Without these awesome projects from the community, this wouldn't be possible.

- [vunb/node-crfsuite](https://github.com/vunb/node-crfsuite) A nodejs binding for crfsuite
- [chokkan/crfsuite](https://github.com/chokkan/crfsuite) a fast implementation of Conditional Random Fields (CRFs)
- [chokkan/liblbfgs](https://github.com/chokkan/liblbfgs) a library of Limited-memory Broyden-Fletcher-Goldfarb-Shanno (L-BFGS)
- [manuels/hpdf.js/compile.sh](https://github.com/manuels/hpdf.js/blob/master/compile.sh)
- [Porting-Examples-and-Demos](https://github.com/emscripten-core/emscripten/wiki/Porting-Examples-and-Demos#utilities)
- [https://web.dev/emscripten-embedding-js-snippets/](https://web.dev/emscripten-embedding-js-snippets/)
- [https://github.com/pinqy520/yoga-layout-wasm/blob/master/Makefile](https://github.com/pinqy520/yoga-layout-wasm/blob/master/Makefile)
