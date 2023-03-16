import { initialize } from "./crfsuite.js";

const CRFSuite = await initialize(
	await fetch(new URL("./crfsuite.wasm", import.meta.url)).then((res) =>
		res.arrayBuffer()
	)
);

export default CRFSuite;