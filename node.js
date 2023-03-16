import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { initialize } from "./crfsuite.js";

const CRFSuite = await initialize(
	await readFile(createRequire(import.meta.url).resolve("./crfsuite.wasm"))
);

export default CRFSuite;