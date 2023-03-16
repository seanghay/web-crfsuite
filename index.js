import crfsuite from './build/crfsuite.mjs';

export async function initialize(wasm) {
	return crfsuite({
		instantiateWasm(info, receive) {
			WebAssembly.instantiate(wasm, info).then((instance) => {
				if (instance instanceof WebAssembly.Instance) {
					receive(instance);
				} else {
					receive(instance.instance);
				}
			});
		}
	})
}
